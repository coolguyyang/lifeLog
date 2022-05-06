<template>
  <div>
    <mytitle :isleft="true" :save="save" :isright="false"/>
    <div class="time">
      <van-cell is-link @click="timeShow = true"
        ><div class="input">
          时间选择<input
            disabled
            v-model="msg.time"
            placeholder="点击选择时间"
          /></div
      ></van-cell>
      <van-popup
        v-model="timeShow"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="timeShow = false"
          @confirm="timeConfirm"
        />
      </van-popup>
    </div>
    <div class="pos">
      <van-cell is-link @click="posShow = true"
        ><div class="input">
          地点选择<input
            disabled
            v-model="msg.pos.address"
            placeholder="点击选择地点"
          /></div
      ></van-cell>
      <van-popup v-model="posShow" position="bottom" :style="{ height: '50%' }">
        <div class="mapcon">
          <baidu-map
            class="map"
            :center="center"
            :zoom="zoom"
            @ready="handler"
            @click="selPos"
          ></baidu-map>
        </div>
      </van-popup>
    </div>
    <div class="text">
      <van-cell-group inset>
        <van-field
          v-model="msg.text"
          rows="3"
          autosize
          type="textarea"
          placeholder="记录所见所想..."
          show-word-limit
        />
      </van-cell-group>
      <van-uploader
        accept="video/*,image/*"
        class="img"
        v-model="fileList"
        :after-read="afterRead"
      >
        <template #preview-cover="{ file }">
          <div class="preview-cover van-ellipsis">{{ file.name }}</div>
        </template>
      </van-uploader>
    </div>
    <div class="share" @click="msg.share = !msg.share">
      <van-icon :name="msg.share ? 'eye' : 'lock'" />{{
        msg.share ? '公开' : '私密'
      }}
    </div>
  </div>
</template>

<script>
import mytitle from '../components/mytitle.vue'
import { Dialog, Notify } from 'vant'
import { mapGetters } from 'vuex'
import { $addLogs, $upload } from '@/utils/api'
export default {
  name: 'add',
  data() {
    return {
      timeShow: false,
      posShow: false,
      center: { lng: 0, lat: 0 },
      zoom: 3,
      map: '',
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(),
      currentDate: '',
      fileList: [],
      msg: {
        time: '',
        pos: {
          address: '',
          point: {
            lng: '',
            lat: '',
          },
        },
        text: '',
        img: [],
        video: [],
        share: false,
      },
    }
  },
  computed: {
    ...mapGetters(['uid']),
  },
  components: { mytitle },
  methods: {
    formatTime(date) {
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      let second = date.getSeconds()
      second = second < 10 ? '0' + second : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    handler(e) {
      this.map = e.BMap
      e.map.addEventListener('touchmove', () => {
        e.map.enableDragging()
      })
      e.map.addEventListener('touchend', () => {
        e.map.disableDragging()
      })
      e.map.disableDragging()
      this.getNowPos().then((res) => {
        this.center = res
      })
      this.zoom = 20
    },
    async getNowPos() {
      const geolocation = new this.map.Geolocation()
      let pos = await new Promise((resolve) => {
        geolocation.getCurrentPosition((p) => {
          resolve(p)
        })
      })
      return pos.point
    },
    async getPosInfo(e) {
      const geoCoder = new this.map.Geocoder()
      let info = await new Promise((resolve) => {
        geoCoder.getLocation(e, (res) => {
          resolve(res)
        })
      })
      return info
    },
    selPos(e) {
      console.log(e.point)
      this.getPosInfo(e.point).then((res) => {
        console.log(res);
        Dialog.confirm({
          message: res.address,
        })
          .then(() => {
            this.msg.pos.point = { ...res.point }
            this.msg.pos.address = res.address
            this.posShow = false
          })
          .catch(() => {})
      })
    },
    timeConfirm() {
      this.msg.time = this.formatTime(this.currentDate)
      this.timeShow = false
    },
    afterRead() {
      let file = this.fileList[this.fileList.length - 1]
      const formdata = new FormData()
      formdata.set('file', file.file)
      $upload(formdata).then((res) => {
        console.log(res.data)
        let data = res.data
        if (data.code === 200) {
          file.type = data.type
          file.url = data.url
        } else {
          console.log(res)
        }
      })
    },
    fileUpload() {
      this.msg.img = []
      this.msg.video = []
      this.fileList.forEach((v) => {
        let obj = { name: v.file.name, url: v.url }
        if (v.type.indexOf('video') !== -1) {
          this.msg.video.push(obj)
        } else if (v.type.indexOf('image') !== -1) {
          this.msg.img.push(obj)
        } else {
          console.log(v.type + '格式不正确')
        }
      })
    },
    async save() {
      let info
      await this.getNowPos().then(async (pos) => {
        await this.getPosInfo(pos).then((res) => {
          info = res
        })
      })
      this.fileUpload()
      let ctime = new Date().getTime()
      let data = {
        ...this.msg,
        uid: this.uid,
        time:this.currentDate?this.currentDate.getTime():this.currentDate,
        ctime: ctime,
        cpos: { address: info.address, point: info.point },
      }
      $addLogs(data).then((res) => {
        console.log(res)
        Notify({ type: 'primary', message: res.data.message })
        if (res.data.status === 0) {
          this.clearForm();
          this.$router.push('./home')
        }
        if (res.data.status === 1&&res.data.uid ==='') {
          this.$router.push('./login')
        }
      })
    },
    clearForm(){
      this.currentDate = ""
      this.fileList = []
      this.msg = {
        time: '',
        pos: {
          address: '',
          point: {
            lng: '',
            lat: '',
          },
        },
        text: '',
        img: [],
        video: [],
        share: false,
      }
    },
  },
  activated() {
    this.posShow = true
    this.$nextTick(function () {
      this.posShow = false
    })
  },
}
</script>

<style lang="scss" scoped>
.time{
  margin-top: 1.3333rem;
}
.time,
.pos {
  .input {
    display: flex;
  }
  input {
    flex-grow: 1;
    border: none;
    margin-left: 0.5333rem;
    background: none;
  }
}
.map {
  height: 50vh;
}
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
.img {
  margin-left: 0.8533rem;
}
.text {
  overflow-y: scroll;
  height: 70vh;
}
.share {
  height: 1.0667rem;
  width: 100%;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding-right: 0.5333rem;
  font-size: 0.3467rem;
}
</style>

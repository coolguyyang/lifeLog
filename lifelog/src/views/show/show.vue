<template>
  <div class="show">
    <mytitle :searchBar="true" :search="search" />
    <div class="con">
      <van-dropdown-menu class="searchBar" active-color="#1989fa">
        <van-dropdown-item
          @open="videoShow = false"
          @close="videoShow = true"
          v-model="type[0]"
          :options="option[0]"
        />
        <van-dropdown-item
          @open="videoShow = false"
          @close="videoShow = true"
          v-model="type[1]"
          :options="option[1]"
        />
      </van-dropdown-menu>
      <div class="list">
        <div class="search">
          <template v-for="(v, key) in showSearch"
            >{{ key }}:<span :key="key"
              >{{ v[0] }} {{ v[1] }} {{ v[2] }}</span
            ></template
          >
        </div>
        <div v-if="img.length===0&&video.length===0&&text.length===0">无结果</div>
        <template v-if="type[0] === 'img'">
          <template v-for="(value, i) in img">
            <div class="kind" :key="'img' + i" v-if="value[0]">
              {{ value[0] }}
            </div>
            <van-image
              class="img"
              width="2.88rem"
              height="2.4rem"
              v-for="(v, j) in value[1]"
              :key="'img' + i + j"
              :src="v.url"
              lazy-load
              @click="showImage(v.url)"
              :alt="v.name"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </template>
        </template>
        <template v-if="type[0] === 'video' && videoShow === true">
          <template v-for="(value, i) in video">
            <div class="kind" :key="'video' + i" v-if="value[0]">
              {{ value[0] }}
            </div>
            <div
              class="video"
              v-for="(v, j) in value[1]"
              :key="'video' + i + j"
            >
              <video
                :src="v.url"
                controls
                style="object-fit: fill"
                @play="videoPlay"
              ></video>
            </div>
          </template>
        </template>
        <template v-if="type[0] === 'text'">
          <template v-for="(value, i) in text">
            <div class="kind" :key="'text' + i" v-if="value[0]">
              {{ value[0] }}
            </div>
            <div
              @click="toInfo(v.uid, v.lid)"
              class="text"
              v-for="(v, j) in value[1]"
              :key="'text' + i + j"
            >
              <div class="text-con" v-html="v.text"></div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import mytitle from '../../components/mytitle.vue'
import { $findBy } from '@/utils/api'
import { ImagePreview } from 'vant'
export default {
  data() {
    return {
      type: ['img', 'default'],
      videoShow: 'true',
      option: [
        [
          { text: '图片', value: 'img' },
          { text: '视频', value: 'video' },
          { text: '文本内容', value: 'text' },
        ],
        [
          { text: '默认排序', value: 'default' },
          { text: '最新', value: 'new' },
          { text: '附近', value: 'near' },
        ],
      ],
      info: [],
      showSearch: {},
    }
  },
  computed: {
    img() {
      return this.getMedia('img')
    },
    video() {
      return this.getMedia('video')
    },
    text() {
      return this.getMedia('text')
    },
  },
  components: {
    mytitle,
  },
  methods: {
    async search(keyWord) {
      await this.findData()
      this.showSearch = {}
      if (/^ *$/.test(keyWord)) {
        return
      }
      console.log(keyWord)
      const Reg = new RegExp(keyWord, 'g')
      this.showSearch[keyWord] = ['', '', '']
      this.info = this.info.filter((v) => {
        let searchKey = [keyWord]
        if (v.text.search(keyWord) !== -1) {
          searchKey.push('文本内容')
          this.showSearch[keyWord][0] = '文本内容'
          v.text = v.text.replace(
            Reg,
            `<span style="color: #eb7340;">${keyWord}</span>`
          )
        }
        if (v.cpos.address.search(keyWord) !== -1) {
          searchKey.push('地点')
          this.showSearch[keyWord][1] = '地点'
          v.text =
            v.cpos.address.replace(
              Reg,
              `<span style="color: #eb7340;">${keyWord}</span>`
            ) +
            '<br>' +
            v.text
        }
        if (v.pos.address.search(keyWord) !== -1) {
          searchKey.push('地点')
          this.showSearch[keyWord][1] = '地点'
          v.text =
            v.pos.address.replace(
              Reg,
              `<span style="color: #eb7340;">${keyWord}</span>`
            ) +
            '<br>' +
            v.text
        }
        if (this.timeTo(v.ctime).search(keyWord) !== -1) {
          searchKey.push('时间')
          this.showSearch[keyWord][2] = '时间'
          v.text =
            this.timeTo(v.ctime).replace(
              Reg,
              `<span style="color: #eb7340;">${keyWord}</span>`
            ) +
            '<br>' +
            v.text
        }
        if (this.timeTo(v.time).search(keyWord) !== -1) {
          searchKey.push('时间')
          this.showSearch[keyWord][2] = '时间'
          v.text =
            this.timeTo(v.ctime).replace(
              Reg,
              `<span style="color: #eb7340;">${keyWord}</span>`
            ) +
            '<br>' +
            v.text
        }
        v.searchKey = searchKey
        return searchKey.length !== 1
      })
      console.log('search', this.info)
    },
    toInfo(uid, lid) {
      this.$router.push({ path: '/info', query: { uid, lid } })
    },
    showImage(url) {
      ImagePreview({
        images: [url],
        closeable: true,
        showIndex: false,
      })
    },
    videoPlay(event) {
      console.log(event)
      let video = event.target
      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen()
      } else if (video.webkitRequestFullScreen) {
        video.webkitRequestFullScreen()
      }
      video.play()
    },
    timeTo(t) {
      if (t) {
        let date = new Date(parseInt(t))
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
      }
      return ''
    },
    sortData(mediaList) {
      if (this.type[1] === 'new') {
        mediaList = mediaList.sort((a, b) => {
          return b.ctime - a.ctime
        })
        mediaList.forEach((v) => {
          v.formT = this.timeTo(v.ctime)
        })
        let map = new Map()
        mediaList.forEach((v) => {
          let date = v.formT.substring(0, v.formT.indexOf(' '))
          if (!map.has(date)) {
            map.set(date, [v])
          } else {
            map.get(date).push(v)
          }
        })
        mediaList = [...map.entries()]
      } else if (this.type[1] === 'near') {
        let center = this.$parent.$currentPos
        mediaList.forEach((v) => {
          let { lat, lng } = v.cpos.point
          v.dis = Math.pow(lat - center.lat, 2) + Math.pow(lng - center.lng, 2)
        })
        mediaList = mediaList.sort((a, b) => {
          return a.dis - b.dis
        })
        let map = new Map()
        mediaList.forEach((v) => {
          if (!map.has(v.cpos.address)) {
            map.set(v.cpos.address, [v])
          } else {
            map.get(v.cpos.address).push(v)
          }
        })
        mediaList = [...map.entries()]
      } else {
        let map = new Map()
        if (mediaList.length !== 0) {
          map.set('', mediaList)
        }
        mediaList = [...map.entries()]
      }
      console.log('show', mediaList)
      return mediaList
    },
    getMedia(type) {
      let mediaList = []
      if (type === 'text') {
        mediaList = [...this.info]
      } else {
        this.info.forEach((v) => {
          if (v[type].length !== 0) {
            v[type].forEach((h) => {
              mediaList.push({
                lid: v.lid,
                uid: v.uid,
                url: h.url,
                name: h.name,
                cpos: v.cpos,
                ctime: v.ctime,
              })
            })
          }
        })
      }
      mediaList = this.sortData(mediaList)
      return mediaList
    },
    async findData() {
      return await $findBy({ uid: this.$store.getters.uid }).then((res) => {
        if (res.data.status === 0) {
          this.info = res.data.data
          this.info.forEach((v) => {
            v.text = v.text.replace(/</g, '&lt;')
          })
          console.log(this.info)
        } else {
          console.log(res)
        }
      })
    },
  },
  activated() {
    let search = ''
    if (Object.keys(this.showSearch)[0]) {
      search = Object.keys(this.showSearch)[0]
    }
    console.log(search)
    this.search(search)
  },
}
</script>

<style lang="scss" scoped>
.show {
  background: #f5f5f5;
  .con {
    .searchBar {
      position: fixed;
      top: 1.3333rem;
      width: 100%;
      z-index: 99;
    }
    .list {
      margin-top: 2.5333rem;
      margin-bottom: 1.3333rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .search {
        margin: 0.2133rem;
        width: 100%;
        color: #eb7340;
        font-size: 0.3733rem;
        span {
          color: #333333;
          font-size: 0.3467rem;
        }
      }
      .kind {
        margin: 0.2133rem;
        width: 100%;
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: 0.48rem;
        font-weight: bold;
      }
      .img,
      .video,
      .text {
        margin: 0.2133rem;
      }
      video {
        width: 2.88rem;
        height: 2.4rem;
      }
      .text {
        width: 100%;
        margin: 0.1067rem 0.2133rem;
        padding: 0.32rem;
        background-color: #fff;
        box-shadow: 0 0.2133rem 0.32rem #ebedf0;
      }
      .text-con {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        font-size: 0.3733rem;
        color: #333333;
      }
    }
  }
}
</style>

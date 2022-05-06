<template>
  <div>
    <mytitle :isleft="true" />
    <div class="content">
      <div class="userinfo">
        <div class="ph">
          <van-image
            round
            width="1.6rem"
            height="1.6rem"
            lazy-load
            :src="user.img ? user.img : DEFAULTHD"
          />
        </div>
        <div class="info">
          <div class="name">{{ user.name }}</div>
          <div class="time">
            <span>{{ ctime }}</span
            >记录，来自<span class="pos" v-if="info.cpos">{{
              info.cpos.address
            }}</span>
          </div>
        </div>
      </div>
      <div class="text">
        <p v-if="info.pos">{{ info.pos.address }}</p>
        <p>{{ time }}</p>
        {{ info.text }}
      </div>
      <div class="media">
        <van-image
          class="img"
          width="2.88rem"
          height="2.4rem"
          v-for="(v, i) in info.img"
          :key="'img' + i"
          :src="v.url"
          lazy-load
          @click="showImage(v.url)"
          :alt="v.name"
        >
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
        <div class="video" v-for="(v, i) in info.video" :key="'video' + i">
          <video :src="v.url" controls style="object-fit: fill"></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mytitle from '@/components/mytitle.vue'
import { $findBy, $getUser } from '@/utils/api'
import DEFAULTHD from '@/assets/default.png'
import { ImagePreview } from 'vant'
export default {
  data() {
    return {
      DEFAULTHD: DEFAULTHD,
      info: {},
    }
  },
  computed: {
    user() {
      return this.info.user ? this.info.user : {}
    },
    time() {
      return this.timeTo(this.info.time)
    },
    ctime() {
      return this.timeTo(this.info.ctime)
    },
  },
  components: {
    mytitle,
  },
  methods: {
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
    showImage(url) {
      ImagePreview({
        images: [url],
        closeable: true,
        showIndex: false,
      })
    },
    async findData(obj) {
      await $findBy(obj.info).then((res) => {
        if (res.data.status === 0) {
          this.info = res.data.data[0]
          console.log(this.info)
        } else {
          console.log(res)
        }
      })
      $getUser(obj.user).then((res) => {
        if (res.data.results) {
          this.$set(this.info, 'user', res.data.results)
        }
        console.log(this.info)
      })
    },
  },
  activated() {
    console.log(this.$route.query)
    this.findData({
      info: { lid: this.$route.query.lid },
      user: { uid: this.$route.query.uid },
    })
  },
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 1.3333rem;
  .media {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .img,
    .video {
      margin: 0.2133rem;
    }
    video {
      width: 2.88rem;
      height: 2.4rem;
    }
  }
  .text {
    margin: 20px 0;
  }
  .userinfo {
    width: 100%;
    height: 1.8667rem;
    display: flex;
    padding: 0.4rem;
    box-sizing: border-box;
    .ph {
      line-height: 1.8667rem;
    }
    .info {
      margin-left: 0.2667rem;
      width: calc(100% - 2rem);
      height: 1.8667rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 0.32rem;
      color: #939393;
      .name {
        font-size: 0.3733rem;
        font-weight: bold;
        color: #333333;
      }
    }
  }
}
</style>

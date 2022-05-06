<template>
  <div id="home">
    <mytitle :isright="true" :range="range" />
    <van-popover
      class="barpos"
      v-model="barType"
      :actions="actions"
      @select="selectBar"
      placement="bottom-end"
    >
      <template #reference>
        <div class="bar" @click="barType = !barType"></div>
      </template>
    </van-popover>
    <div v-show="changeType" class="info-show">
      <van-tabs
        class="searchBar"
        color="#fb7299"
        title-active-color="#fb7299"
        title-inactive-color="#757575"
        type="line"
        :active="-1"
        @change="selectTab"
      >
        <van-tab title="默认排序" />
        <van-tab title="最新" />
        <van-tab title="附近" />
      </van-tabs>
      <div class="list">
        <router-link
          v-for="i in info"
          :to="{ name: 'Info', query: { uid: i.uid, lid: i.lid } }"
          :key="i.lid"
        >
          <div class="item">
            <div class="ph" v-if="i.img[0]">
              <img v-lazy="i.img[0].url" :alt="i.img[0].name" />
            </div>
            <div class="info">
              <div class="text">{{ i.text }}</div>
              <div class="pos">{{ i.cpos.address }}</div>
              <div class="time">{{ i.ctime | timeTranform }}</div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-show="!changeType" class="map-show">
      <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler">
        <template v-for="(v, i) in posInfo">
          <template v-for="(p, j) in v[1]">
            <bm-marker
              v-if="p.cpos"
              :key="'p' + i + j"
              :position="p.cpos.point"
              @click="infoShow(v,p)"
            >
            </bm-marker>
          </template>
        </template>
      </baidu-map>
      <van-popup
        v-model="mapShow"
        position="right"
        :style="{ height: '84%' }"
        round
        :overlay="false"
        :closeable="true"
        :close-on-click-overlay="false"
      >
        <div class="map-info-detail" v-if="mapDetail.length !== 0">
          <div class="detail-pos">{{ mapDetail.lid}}{{mapDetail.text}}{{mapDetail.cpos}}</div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import mytitle from '../../components/mytitle.vue'
import { $findBy } from '@/utils/api'
export default {
  name: 'home',
  data() {
    return {
      range: '公开',
      barType: false,
      changeType: true,
      seachData: { share: 1 },
      sortType: 0,
      info: [],
      center: {},
      zoom: 20,
      mapShow: false,
      mapDetail: [],
    }
  },
  filters: {
    timeTranform(v) {
      let d = new Date(+v)
      return d.getMonth() + 1 + '月' + d.getDate() + '日'
    },
  },
  computed: {
    actions() {
      let select = [
        { text: '切换', icon: 'exchange' },
        { text: '公开', icon: 'chat-o' },
      ]
      if (!this.$store.getters.token) {
        select.push({ text: '登录', icon: 'user-o' })
      } else {
        select.push({ text: '我的', icon: 'user-o' })
      }
      return select
    },
    posInfo() {
      let map = new Map()
      this.info.forEach((v) => {
        if (!map.has(v.cpos.address)) {
          map.set(v.cpos.address, [v])
        } else {
          map.get(v.cpos.address).push(v)
        }
      })
      let infoP = [...map.entries()]
      console.log('111', infoP)
      return infoP
    },
  },
  methods: {
    handler(e) {
      e.map.addEventListener('touchmove', () => {
        e.map.enableDragging()
      })
      e.map.addEventListener('touchend', () => {
        e.map.disableDragging()
      })
      e.map.disableDragging()
      const geolocation = new e.BMap.Geolocation()
      geolocation.getCurrentPosition((p) => {
        console.log(p.point)
        this.center = p.point
      })
    },
    infoShow(v,p) {
      this.mapShow = true
      console.log('show', v,p)
      this.mapDetail = p
    },
    selectBar(actions) {
      if (actions.text === '切换') {
        this.changeType = !this.changeType
      } else if (actions.text === '公开') {
        this.seachData = { share: 1 }
        this.findData()
        this.range = actions.text
      } else if (actions.text === '登录') {
        this.$router.push('/login')
        this.barType = false
      } else {
        this.seachData = { uid: this.$store.getters.uid }
        this.findData()
        this.range = actions.text
      }
    },
    selectTab(index) {
      if (index === 0) {
        this.sortType = 0
      } else if (index === 1) {
        this.sortType = 1
      } else {
        this.sortType = 2
      }
      this.findData()
    },
    posCompare() {
      console.log(this.center)
      this.info.forEach((v) => {
        let { lat, lng } = v.cpos.point
        v.dis =
          Math.pow(lat - this.center.lat, 2) +
          Math.pow(lng - this.center.lng, 2)
      })
      this.info = this.info.sort((a, b) => {
        return a.dis - b.dis
      })
    },
    dataSort() {
      if (this.sortType === 0) {
        console.log('默认')
      } else if (this.sortType === 1) {
        this.info = this.info.sort((a, b) => {
          return b.ctime - a.ctime
        })
      } else {
        console.log('address')
        this.posCompare()
      }
    },
    async findData() {
      await $findBy(this.seachData).then((res) => {
        if (res.data.status === 0) {
          this.info = res.data.data
          console.log(this.info)
        } else {
          console.log(res)
        }
      })
      this.dataSort()
    },
  },
  components: {
    mytitle,
  },
  activated() {
    this.findData()
  },
}
</script>

<style lang="scss" scoped>
#home {
  background: #f5f5f5;
  .barpos {
    .bar {
      width: 0.453333rem;
      height: 0.4267rem;
    }
    position: fixed;
    top: 0.4rem;
    right: 0.266667rem;
    z-index: 99;
  }
  .info-show {
    .searchBar {
      position: fixed;
      top: 1.3333rem;
      width: 100%;
    }
    .list {
      margin-top: 2.5333rem;
      margin-bottom: 1.3333rem;
      a {
        display: block;
        text-decoration: none;
        padding-left: 0.4rem;
        margin: 0.2133rem;
        color: #666;
        background: #fff;
        box-shadow: 0 0.2133rem 0.32rem #ebedf0;
      }
      .item {
        display: flex;
        width: 100%;
        .ph {
          height: 2.533333rem;
          margin-top: 0.32rem;
          img {
            width: 2.88rem;
            height: 2.4rem;
          }
        }
        .info {
          width: calc(100% - 2.88rem);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0.32rem 0.373333rem 0.32rem 0;
          margin-left: 0.533333rem;
          height: 2.4rem;
          font-size: 0.32rem;
          color: #939393;
          .text {
            width: 100%;
            height: 1.44rem;
            line-height: 0.48rem;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            font-size: 0.4267rem;
            color: #333333;
          }
        }
      }
    }
  }
  .map-show {
    margin-top: 1.3333rem;
    .map {
      height: calc(100vh - 2.6667rem);
    }
    .map-info-detail {
      width: 5rem;
    }
  }
}
</style>

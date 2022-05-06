<template>
  <div>
    bar 附近 最新 recommend
    <div><span>nowTime:</span>{{ nowTime }}</div>
    <div v-if="pos.coords && pos.coords.latitude">
      <span>nowAddress:</span>{{ pos.coords.latitude }}----{{
        pos.coords.longitude
      }}
    </div>
    <span>speed:</span
    ><span v-if="pos.coords && pos.coords.speed">{{ pos.coords.speed }}</span
    ><span v-else>0</span> pos:{{ pos }}
  </div>
</template>

<script>
export default {
  name: 'recommend',
  data() {
    return {
      msg: '',
      pos: '',
    }
  },
  computed: {
    nowTime() {
      return new Date()
    },
  },
  methods: {
    search(...v){
      console.log(v);
    }
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 显示地理信息
          this.pos = position
          console.log(this.pos)
        },
        function (err) {
          // 错误处理
          switch (err.code) {
            case 1:
              alert('位置服务被拒绝。')
              break

            case 2:
              alert('暂时获取不到位置信息。')
              break

            case 3:
              alert('获取信息超时。')
              break

            default:
              alert('未知错误。')
              break
          }
        },
        {
          enableHighAccuracy: true,
          // maximumAge: 100,
          accuracy: 1,
        }
      )
    } else {
      alert('你的浏览器不支持使用HTML5来获取地理位置信息')
    }
  },
}
</script>

<style lang="scss" scoped>
.search{
   position: fixed;
      top: 1.3333rem;
      width: 100%;
}
</style>

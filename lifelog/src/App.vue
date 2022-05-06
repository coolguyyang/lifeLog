<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
    <Myfooter
      v-if="
        $route.path.match('/home') ||
        $route.path.match('/show') ||
        $route.path.match('/recommend') ||
        $route.path == '/my'
      "
    />
    <div v-show="map">
      <baidu-map @ready="handler"></baidu-map>
    </div>
  </div>
</template>
<script>
import Myfooter from './components/Myfooter.vue'
export default {
  name: 'App',
  data() {
    return {
      map: false,
    }
  },
  components: {
    Myfooter,
  },
  methods: {
    handler(e) {
      const geolocation = new e.BMap.Geolocation()
      geolocation.getCurrentPosition((p) => {
        this.$currentPos = p.point;
      })
    },
  },
}
</script>

<style lang="scss">
#app {
  a {
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  padding: 0;
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import BMapGL from "vue-baidu-map"
import {
  Cell,
  Icon,
  Overlay,
  DatetimePicker,
  Popup,
  Field,
  CellGroup,
  Uploader,
  Popover,
  DropdownMenu,
  DropdownItem,
  Lazyload,
  Tab,
  Tabs,
  Image as VanImage,
  Loading
} from "vant"


import "lib-flexible"
Vue.use(BMapGL, {
  ak: 'EsCjaTRh6w4qLow45777ZmAS0gT8rlKS' //去百度地图官网申请的ak
})

Vue.use(Cell).use(Icon).use(Overlay).use(DatetimePicker).use(Popup).use(Field)
  .use(CellGroup).use(Uploader).use(Popover).use(DropdownMenu).use(DropdownItem)
  .use(Lazyload).use(Tab).use(Tabs).use(VanImage).use(Loading)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

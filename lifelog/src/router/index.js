import Vue from 'vue'
import VueRouter from 'vue-router'
import Add from '../views/add.vue'
import store from '../store/index'
Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: '/add',
    name: 'Add',
    component: Add
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/home.vue')
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import(/* webpackChunkName: "recommend" */ '../views/recommend/recommend.vue')
  },
  {
    path: '/show',
    name: 'Show',
    component: () => import(/* webpackChunkName: "show" */ '../views/show/show.vue')
  },
  {
    path: '/my',
    name: 'My',
    component: () => import(/* webpackChunkName: "my" */ '../views/user/my.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/user/login.vue')
  },
  {
    path: '/info',
    name: 'Info',
    component: () => import(/* webpackChunkName: "info" */ '../views/info.vue')
  },
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path == "/my"||to.path == "/show") {
    if (store.getters.token) {
      next()
    } else {
      next("/login")
    }
  } else {
    next()
  }
})
export default router

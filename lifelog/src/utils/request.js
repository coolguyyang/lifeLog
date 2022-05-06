/*******************************************************************
 * @Desc         : 
 * @Author       : YZB
 * @Date         : 2022-03-30 21:00:44
 * @LastEditors  : YZB
 * @LastEditTime : 2022-04-18 22:59:35
*******************************************************************/
import axios from "axios"
import store from "../store"
import http from "./http"
import { Toast } from 'vant'
const service = axios.create({
  baseURL: http.server,
  timeout: 10000
})
service.interceptors.request.use(
  (config) => {
    console.log(config)
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    })
    config.headers['user-token'] = store.getters.token
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  (response) => {
    console.log(response)
    Toast.clear();
    if (response.status === 200) {
      return response
    } else {
      return Promise.reject(response)
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
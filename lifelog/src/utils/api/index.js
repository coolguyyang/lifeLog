/*******************************************************************
 * @Desc         : 
 * @Author       : YZB
 * @Date         : 2022-03-30 21:05:20
 * @LastEditors  : YZB
 * @LastEditTime : 2022-04-11 22:33:58
*******************************************************************/
import request from "../request"

export const $findBy = (params) => {
  return request.get("/findBy", { params })
}
export const $addLogs = (params) => {
  return request.post("/addlogs", params)
}
export const $upload = (params) => {
  return request.post("/upload", params)
}
export const $getUser = (params) => {
  return request.get("/user",{params})
}
const db = require('../../db/db')
const bcrypt = require('bcryptjs')
const config = require('../../config')
const jwt = require('jsonwebtoken')
class User {
  constructor() {

  }
  async register (ctx) {
    //接收数据
    let info = ctx.request.body
    console.log(info, "尝试注册")
    //不为空检查
    if (!info.tel || !info.password) {
      ctx.body = {
        status: 1,
        message: "电话和密码不能为空！"
      }
      return
    }
    //是否已存在
    const sqlSel = 'select * from user where tel=?'
    let res = await new Promise((resolve, reject) => {
      db.query(sqlSel, [info.tel], function (err, result) {
        if (err) {
          reject({ status: 1, message: err.message })
        }
        if (result.length > 0) {
          resolve({ status: 1, message: '电话已被注册' })
        }
        resolve("sucess")
      })
    })
    if (res !== "sucess") {
      ctx.body = res
      return
    }
    //对密码进行加密处理,将用户信息插入数据库
    const salt = bcrypt.genSaltSync(12)
    let password = bcrypt.hashSync(info.password, salt)
    const sqlIns = 'insert into user set ?'
    res = await new Promise((resolve, reject) => {
      db.query(sqlIns, { name: info.userName, password: password, tel: info.tel }, function (err, results) {
        if (err) {
          reject({ status: 1, message: err.message })
        }
        else if (results.affectedRows !== 1) {
          resolve({ status: 1, message: '注册用户失败，请稍后再试！' })
        }
        else {
          resolve({ status: 0, message: '注册成功' })
        }

      })
    })
    ctx.body = res
    console.log(res)
  }
  async login (ctx) {
    const userinfo = ctx.request.body
    console.log(userinfo, "尝试登陆")
    if (!userinfo.tel || !userinfo.password) {
      ctx.body = {
        status: 0,
        message: '请输入账号密码'
      }
      return
    }
    const sql = `select * from user where tel=?`
    let res = await new Promise((resolve, reject) => {
      db.query(sql, userinfo.tel, function (err, results) {
        if (err) {
          reject({ status: 1, message: err.message })
        }
        else if (results.length !== 1) {
          resolve({ status: 2, message: '账号不存在' })
        }
        else {
          const { password, ...user } = results[0]
          const compareResult = bcrypt.compareSync(userinfo.password, password)
          if (!compareResult) resolve({ status: 3, message: '账号或密码错误' })
          const tokenJWT = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h'
          })
          resolve({ status: 0, message: user, token: 'Bearer ' + tokenJWT })
        }

      })
    })
    ctx.body = res
    console.log(res.message)
  }
  async getUserInfo (ctx) {
    let info = ctx.query
    console.log(info)
    if(!info.uid)
    {
      console.log("uid not found");
      ctx.body = {status: 1,msg:"error"}
      return
    }
    const sqlIns = `select * from user where uid=${info.uid} `
    let res = await new Promise((resolve, reject) => {
      db.query(sqlIns, function (err, results) {
        if (err) {
          reject({ status: 1, message: err.message })
        }
        else {
          // console.log(results);
          resolve({ status: 0, message: '查询成功', results:{...results[0],password:""}})
        }

      })
    })
    console.log(res.message)
    ctx.body = res
  }

}

module.exports = new User()

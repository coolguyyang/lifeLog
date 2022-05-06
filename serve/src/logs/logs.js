const db = require("../../db/db")
const config = require("../../config")

class Logs {
  constructor() { }
  async add (ctx) {
    let info = ctx.request.body
    // console.log("info:", info)
    //不为空检查
    if (!info.uid || !info.ctime || !info.cpos || !info.text) {
      ctx.body = {
        status: 1,
        uid: info.uid,
        message: "添加信息不足！",
      }
      return
    }
    //将信息插入数据库
    const sqlIns = "insert into logs set ?"
    let res = await new Promise((resolve, reject) => {
      db.query(
        sqlIns,
        {
          uid: info.uid,
          ctime: info.ctime,
          cpos: JSON.stringify(info.cpos),
          time: info.time,
          pos: JSON.stringify(info.pos),
          text: info.text,
          share: info.share,
          img: JSON.stringify(info.img),
          video: JSON.stringify(info.video),
        },
        function (err, results) {
          if (err) {
            reject({ status: 1, message: err.message });
          }
          else if (results.affectedRows !== 1) {
            resolve({ status: 1, message: "添加失败，请稍后再试！" });
          }
          else {
            resolve({ status: 0, message: "添加成功" });
          }

        });
    });

    ctx.body = res;
    console.log(res.message);
  }
  async findBy (ctx) {
    let info = ctx.query;
    let condition = "";
    let valueKey = "";
    console.log(info);
    if (Object.keys(info).length > 0) {
      condition += "where ";
      Object.keys(info).forEach((v, i) => {
        if (!info[v]) {
          valueKey = v;
        }
        if (i !== 0) {
          condition += ` and `;
        }
        condition += `${v}=${info[v]}`;
      })
    }
    if (valueKey) {
      ctx.body = {
        status: 1,
        message: `${valueKey}的值有误！！！`,
      }
      return;
    }
    const sqlIns = `select * from logs ${condition} `;
    let res = await new Promise((resolve, reject) => {
      db.query(
        sqlIns, 
        function (err, results) {
        if (err) {
          reject({ status: 1, message: err.message });
        }
        else {
          // console.log(results);
          let data = [];
          results.forEach( (v) => {
            let info = {
              ...v,
              pos: JSON.parse(v.pos),
              cpos: JSON.parse(v.cpos),
              img: JSON.parse(v.img),
              video: JSON.parse(v.video),
            }
            info.img.forEach( (v) => {
              v.url = config.server + v.url;
            })
            info.video.forEach( (v) => {
              v.url = config.server + v.url;
            })
            data.push(info);
          })
          resolve({ status: 0, message: '查询成功', data });
        }

      })
    })
    console.log(res.message);
    ctx.body = res;
  }

}

module.exports = new Logs()

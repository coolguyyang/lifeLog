var mysql = require('mysql');
let db;
try {
    db = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'lifelog'
      });
} catch (error) {
    console.log('连接失败！');
}
module.exports = db;

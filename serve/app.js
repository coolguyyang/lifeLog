const Koa = require('koa')
const app = new Koa()
const serve = require('koa-static')
const path = require('path')
const cors = require('@koa/cors')
const router = require('./router/index')
const bodyParser = require('koa-bodyparser')
const home = serve(path.join(__dirname) + '/public/')
const config = require('./config')
// console.log('_dirname', __dirname);
// console.log('path.::' , path.join(__dirname) + '/public/');
app.use(cors())
app.use(bodyParser())
app.use(home)

router.initRouter(app)
app.listen(config.port, config.host, () => {
  console.log('服务已启动，在 '+config.server)
})
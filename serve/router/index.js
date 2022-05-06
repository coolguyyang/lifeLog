const Router = require("koa-router");
const router = new Router();
const upload = require('../src/upload/upload');

const user = require("../src/login/server");
const logs = require('../src/logs/logs');
const file = require("../src/upload/server");

router.post('/register',user.register);
router.post('/login',user.login);
router.get('/user',user.getUserInfo);

router.post('/addlogs',logs.add);
router.get('/findBy',logs.findBy);
router.post('/upload',upload.single('file'),file.addFile);
function initRouter(app) {
    app.use(router.routes());
}
module.exports = {
    initRouter
}
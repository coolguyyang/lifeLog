module.exports = {
    //对webpack的扩展
    publicPath: './',  //根目录的路径 ,打包的时候一定会用到的
    lintOnSave: true,//  配置 eslint的语法检查
    // devServer: {//开发配置
    //     host: '127.0.0.1',//域名
    //     port: 8080,//端口
    //     https: false,//是否允许https协议
    //     open: true,//打开浏览器
    //     proxy: {//跨域
    //         '/': {//你要替换的位置
    //             target: 'http://192.168.31.154:8888/', //被替换的目标地址
    //             //host    网络服务器  http://yinruifang.cn
    //             //ws: true,  // proxy websockets
    //             //secure: true,//接受对方是https的接口
    //             changeOrigin: true,  // 是否需要跨域 needed for virtual hosted sites
    //             pathRewrite: {
    //                 '^/': '/'  // rewrite path 路径重写
    //             }
    //         },
    //     },
    // }
    
}
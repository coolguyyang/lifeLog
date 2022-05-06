const url =  
// "192.168.137.1"
"172.19.160.249"
// "172.19.160.2"
// "192.168.31.154"
const port = 
8888
module.exports = {
    jwtSecretKey:"lifelog",
    host:url,
    port:port,
    server:'http://'+url+':'+port
}
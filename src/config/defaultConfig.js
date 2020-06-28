
module.exports={
    root:process.cwd(),
    hostname:'127.0.0.1',
    port:9527,
    compress:/\.(html|js|css|md)/,
    cache:{
        maxAge:600,
        expires:true,
        cacheControl:true,
        lastModified:true,
        etage: true
    }  //浏览器向服务发送请求，先检查本地缓存
};

//压缩文件
const{createGzip,createDeflate}=require('zlib');

module.exports=(rs,req,res)=>{
   const acceptEncoding=req.headers['accept-encoding'];
   if(!acceptEncoding||acceptEncoding.match(/\b(gzip|deflate)\b/)){
       return rs;
   } else if(acceptEncoding.match(/\bgzip\b/)){
       res.setHeader('Content-Encoding','gzip');
      return rs.pip(createGzip());
   }else if(acceptEncoding.match(/\bdeflate\b/)){
    res.setHeader('Content-Encoding','deflate');
    return rs.pip(createDeflate());
   }
};
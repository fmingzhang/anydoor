const fs=require('fs');
const path=require('path');
const promisify=require('util').promisify; //promisify去掉回调函数
const stat=promisify(fs.stat)
const readdir=promisify(fs.readdir);
const Handlebars=require('handlebars');
const mime=require('./mime');
const compress=require('./compress');  //压缩
const range=require('./range');  //http协议，读取部分内容
const isFresh=require('./cache'); //服务器具有缓存的功能

const tplPath=path.join(__dirname,'../template/dir.tpl');
const source=fs.readFileSync(tplPath);
const template=Handlebars.compile(source.toString());

//const config=require('../config/defaultConfig')
//通过async\await 进行异步调用

module.exports =async function(req,res,filePath,config){
    try{
        const stats=await stat(filePath);
        if(stats.isFile()){
          const contentType=mime(filePath);

          res.setHeader('Content-Type',contentType);
          if(isFresh(stats,req,res)){
            res.statusCode=304;
            res.end();
            return;
          }


          let rs;
          const {code,start,end}=range(stats.size,req,res);
          if(code===200){
            res.statusCode=200;
            rs=fs.createReadStream(filePath);
          }
            else{
              res.statusCode=206;
              rs=fs.createReadStream(filePath,{start,end});
            }
         
          if(filePath.match(config.compress)){
              rs=compress(rs,req,res);
          }
          rs.pipe(res);
         } else if(stats.isDirectory()){
              const files=await readdir(filePath);
              
               res.statusCode=200;
               res.setHeader('Content-Type','text/html'); 
               const dir=path.relative(config.root,filePath);
               const data={
                title:path.basename(filePath), 
                dir: dir ? `/${dir}` : '',
                files:files.map(file=>{
                  return{
                    file,
                    icon:mime(file)
                  }
                })
               };

               
               res.end(template(data));
             }
          
         }   catch (ex){
           console.error(ex);
           
      res.statusCode=404;
      res.setHeader('Content-Type','text/plain');
      res.end(`${filePath} is not a directory or file\n ${ex.toString()}`);
   }



}
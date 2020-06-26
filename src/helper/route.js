const fs=require('fs');
const path=require('path');
const promisify=require('util').promisify; //promisify去掉回调函数
const stat=promisify(fs.stat)
const readdir=promisify(fs.readdir);
const Handlebars=require('handlebars');
const mime=require('./mime');
const compress=require('./compress');


const tplPath=path.join(__dirname,'../template/dir.tpl');
const source=fs.readFileSync(tplPath);
const template=Handlebars.compile(source.toString());

const config=require('../config/defaultConfig')
//通过async\await 进行异步调用

module.exports =async function(req,res,filePath){
    try{
        const stats=await stat(filePath);
        if(stats.isFile()){
          const contentType=mime(filePath);



          res.statusCode=200;
          res.setHeader('Content-Type',contentType);
         let rs= fs.createReadStream(filePath);
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
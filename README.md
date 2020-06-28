# anydoor
tiny NodeJS Static Web server
静态资源服务器，类似文件服务器

## 使用方法
使用到的第三方模块：eslint(检查代码)、handlebars(可点击目录) yargs(生成命令行)

## 安装
```
npm i -g anydoor
```
## 使用方法
```
anydoor  #把当前文件夹作为静态资源服务器根目录
anydoor -p 8080 # 设置端口号为8080
anydoor -h localhost #设置host 为localhost
anydoor -d /usr  #设置根目录为/usr
```
## 使用命令行
## 例如:
node src/index.js -p 9999  # 设置端口号9999启动
node src/index.js --port=9999  # 设置端口号9999启动

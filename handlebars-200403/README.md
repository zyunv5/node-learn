
@ 来自米斯特吴 NodeJS 实战项目(课程管理) 个人练习
1. mongoose连接数据库
2. handlebars 模板引擎
3. config/passport.js密码的封装 passport、bcrypt
4. index.js中有使用静态文件
5. 有配置之全局变量

## 启用 handlebars

npm install express-handlebars --save

### 配置 handlebars
```
头部引入
var exphbs=require("express-handlebars")

配置这个中间件
app.engine("handlebars",exphbs({
    defaultLayout:"main"
}));
app.set("view engine","handlebars");
```

### 当前目录设置
设置一个 views 文件夹
文件夹下有 layouts 文件夹
文件夹下有 mian.handlebars 文件

views 文件夹下根据你的路由，创建
路由.js 文件

## 引入公共组件

### 在 views 下创建 partials 文件夹

创建_nav.handlebars 文件
之后再 main.handlebars 中{{> _nav}} 引入

## 引入库 body-parser 以便于post请求

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

# 下载并使用 mongoDB

去官网 www.mongoDB.com 下载
mongodb-osx-ssl-x86_64-4.0.9.taz
解压出来文件夹
重命名为 mongoDB
放到个人的文件夹下
在 MongoDB 文件夹内建立 data 文件夹
data 文件夹内建立 db 文件夹

# 更改启动路径

终端内 找到 mongoDB 的 bin 文件夹下
之后 ./mongod --dbpath ~/mongodb/data/db
成功后，再开一个终端，
之后利用./mongo 进入 mongoDB

# 查看当前 mongoDB

show databases 查看当前的表

use xxxx
进入到指定表下

show collections
查看下一级

db.xxx.find()
查看表内所有的数据

#nodejs 配置 mongoose
cnpm install mongoose

# mac 杀死指定端口

sudo lsof -t -i:27017
返回 pid 例如 467
kill pid

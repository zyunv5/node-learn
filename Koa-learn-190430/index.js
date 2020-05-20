const Koa = require("koa");
// const json = require("koa-json");
const KoaRouter = require("koa-router");
const path = require("path");
const render = require("koa-ejs");
const mongoose = require("mongoose");
const db = require("./config/keys");
const bodyParser = require("koa-bodyparser");
const passport = require("koa-passport");
// const redis = require("redis");
// let client = redis.createClient(db.RDS_PORT, db.RDS_HOST, db.RDS_OPTS);
const app = new Koa();
const router = new KoaRouter();

//json pretty
// app.use(json());

//使用bodyParser
app.use(bodyParser());
//使用koa-passport
app.use(passport.initialize());
app.use(passport.session());

//回调到config中的passport.js中
require("./config/passport")(passport);

//连接数据库
mongoose
  .connect(db.mongoURL, {
    useNewUrlParser: true,useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB connect");
  })
  .catch(err => {
    console.log(err);
  });

//连接redis
// client.on("ready", (err, result) => {
//     console.log("result");
// });

//引入users.js
const users = require("./router/api/users");
//profile.js
const profile = require("./router/api/profile");
//post.js
const posts = require("./router/api/posts");

//配置模板引擎
render(app, {
  root: path.join(__dirname, "views"),
  layout: "layout",
  viewExt: "html",
  cache: false,
  debug: false
});

// //路由跳转 index
router.get("/", index);

// //函数声明 index
async function index(ctx) {
    await ctx.render("index", {
        title: "what fuck?",
        things: {name:"aa"}
    })
}

//配合路由模块
app.use(router.routes()).use(router.allowedMethods());

//配置路由地址
router.use("/api/users", users);
router.use("/api/profile", profile);
router.use("/api/posts", posts);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

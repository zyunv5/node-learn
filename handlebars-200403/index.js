const express = require("express");
const _ = require("lodash");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const passport = require("passport");
const request = require("request");
const app = express();

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

app.use(bodyParser.json()); //加载处理post body请求体的中间件函数
app.use(bodyParser.urlencoded({ extended: false }));

const ideas = require("./routes/ideas"); //此处引入路由
const users = require("./routes/users");

require("./config/passport")(passport); //引入config下面的passportJs并调用模块

const db = require("./config/database");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//connect to mongoose
mongoose
  .connect(db.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDb");
  })
  .catch(err => {
    console.log(err);
  });
//引入模型
require("./models/Ideas");
const Idea = mongoose.model("ideas"); //在node-app下创建了一个ideas表

// 使用静态文件;
app.use(express.static(path.join(__dirname, "public")));

// method - override;
app.use(methodOverride("_method"));//接受views/users/login内的表单的请求

// (express - session) & flash;
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//配置全局变量
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => {
  const title = "大家好";
  res.render("index", {
    title: title
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.use("/ideas", ideas);
app.use("/users", users);

const port = process.env.PORT || 5566;

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

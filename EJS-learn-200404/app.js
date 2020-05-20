const express = require("express");
const app = express();
//引入自定义模块
const todoController = require("./controller/todoController")

app.set("view engine", "ejs");
app.use(express.static("./public"));

todoController(app);
app.listen(3000);
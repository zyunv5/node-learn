//引入该路由所需使用的模块
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//引入模型
require("../models/Ideas");
const Idea = mongoose.model("ideas"); //在node-app下创建了一个ideas表
//bodyParser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

const router = express.Router();

const { ensureAuthenticated } = require("../helps/auth");

router.post("/common/request", function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");

  const result = {
    status: -1,
    message: "Failed",
    data: null
  };

  if (!_.isString(req.body.options)) {
    result.message = "options 必须为可json.parse的字符串";
    return res.json(result);
  }

  const options = JSON.parse(req.body.options);

  if (!options.url && !options.uri) {
    result.message = "url 或 uri必传";
    return res.json(result);
  }

  // 请求方法默认为GET
  options.method = options.method ? options.method.toUpperCase() : "GET";

  request(options, function(error, response, body) {
    if (error) {
      result.message = error.message;

      return res.json(result);
    }

    result.status = 1;
    result.message = "ok";
    try {
      result.data = JSON.parse(body);
    } catch (error) {
      result.status = 2;
      result.data = body;
    }

    return res.json(result);
  });
});

router.get("/", (req, res) => {
  Idea.find({
    user: req.user.id
  })
    .sort({
      date: "desc"
    }) //进行排序
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// //添加
// router.get("/add", ensureAuthenticated, (req, res) => {
//   res.render("ideas/add");
// });

// //编辑
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      //查看编辑的内容是否是当前用户所有的
      req.flash("error_msg", "非法操作");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        idea: idea
      });
    }
  });
});

router.post("/", urlencodedParser, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      text: "请输入标题！"
    });
  }
  if (!req.body.details) {
    errors.push({
      text: "请输入详情！"
    });
  }
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "数据添加成功");
      res.redirect("/ideas");
    });
  }
});

router.put("/:id", urlencodedParser, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      req.flash("success_msg", "数据编辑成功");
      res.redirect("/ideas");
    });
  });
});

// //删除
router.delete("/:id", (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "数据删除成功");
    res.redirect("/ideas");
  });
});

module.exports = router; //将路由暴露出去

var bodyParser = require("body-parser");
var urlencoded = bodyParser.urlencoded({
  extended: false
});

// var mongoose =require("mongoose");

// mongoose.connect("");

// //创建图表
// var todoSchema=new mongoose.Schema({
//   item:String
// })

// //往数据库中存储数据
// var Todo=mongoose.model("Todo",todoSchema);

// Todo({item:"Hello Everyon!"}).save(function(err,data){
//   if(err) throw err;
//   console.log("saved!")
// })
var data = [
  {
    item: "一点儿一横长"
  },
  {
    item: "单人顶房梁"
  },
  {
    item: "多字写办个"
  }
];
module.exports = function(app) {
  //获取数据
  app.get("/todo", function(req, res) {
    res.render("todo", {
      todos: data
    });
  });
  //传递数据
  app.post("/todo", urlencoded, function(req, res) {
    data.push(req.body);
  });
  //删除数据
  app.delete("/todo/:item", urlencoded, function(req, res) {
    data = data.filter(todo => {
      return req.params.item !== todo.item;
    });
    res.json(data);
  });
};

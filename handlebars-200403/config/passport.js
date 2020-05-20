const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //密码加密模块

//加载model
const User = mongoose.model("users");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email"
      },
      (email, password, done) => {
        //查询数据库
        User.findOne({
          email: email
        }).then(user => {
          if (!user) {
            // req.flash("error_msg", "用户不存在");
            // res.redirect("/users/login");
            // return;
            return done(null, false, {
              message: "没有这个用户"
            });
          }
          //验证密码
          // Load hash from your password DB.
          bcrypt.compare(password, user.password, (err, isTrue) => {
            if (err) throw err;
            if (isTrue) {
              // req.flash("success_msg", "登录成功");
              // res.redirect("/ideas");
              return done(null, user);
            } else {
              // req.flash("error_msg", "密码错误");
              // res.redirect("/users/login");
              return done(null, false, {
                message: "密码错误"
              });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

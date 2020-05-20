const KoaRouter = require("koa-router");
const router = new KoaRouter();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const tools = require("../../config/tools");
const jwt = require('jsonwebtoken');
const keys = require("../../config/keys");
const passport = require("koa-passport");
// const redis = require("redis");
// let client = redis.createClient(keys.RDS_PORT, keys.RDS_HOST, keys.RDS_OPTS);
// const tokenRedis=require("../../config/tokenRedis");

//引入模型User
const User = require("../../models/User");

//引入input验证
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
/*
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get("/test", async ctx => {
  ctx.status = 200;
  ctx.body = {
    msg: "user works"
  };
});

/*
 * @route POST api/users/register
 * @desc 注册接口地址
 * @access 接口是公开的
 */
router.post("/register", async ctx => {
  // console.log(ctx.request.body);
  const {
    errors,
    isValid
  } = validateRegisterInput(ctx.request.body);

  //判断是否验证通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }

  //存储到数据库
  const findResult = await User.find({
    email: ctx.request.body.email
  });
  // console.log(findResult);
  if (findResult.length > 0) {
    ctx.status = 500;
    ctx.body = {
      email: "邮箱已被占用"
    }
  } else {
    const avatar = gravatar.url(ctx.request.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      avatar,
      password: tools.enbcrypt(ctx.request.body.password), //进入数据库加密
    });

    // await bcrypt.genSalt(10, (err, salt) => {
    //   bcrypt.hash(newUser.password, salt, (err, hash) => {
    //     // console.log(hash);
    //     if (err) throw err;
    //     newUser.password = hash
    //   });
    // });

    // console.log(newUser);
    await newUser.save().then(user => {
      ctx.body = user;
    }).catch(err => {
      throw err;
    });

    //返回json数据
    ctx.body = newUser;
  }
});

/*
 * @route POST api/users/login 
 * @desc 登录接口地址 返回token
 * @access 接口是公开的
 */
router.post("/login", async ctx => {
  const {
    errors,
    isValid
  } = validateLoginInput(ctx.request.body);

  //判断是否验证通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  //查询
  const findResult = await User.find({
    email: ctx.request.body.email
  });
  const user = findResult[0];
  const password = ctx.request.body.password;
  //判断是否查到
  if (findResult.length == 0) {
    ctx.status = 404;
    ctx.body = {
      email: "该邮箱未注册"
    };
  } else {
    //验证密码
    let result = await bcrypt.compareSync(password, user.password);
    // console.log(result, password, user.password);
    //验证通过
    if (result) {
      //返回token
      const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
      const token = jwt.sign(payload, keys.secretOrKey, {
        expiresIn: 3600
      });
      // console.log(jwt);

      ctx.status = 200;
      ctx.body = {
        success: true,
        token: "Bearer " + token
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        password: "密码错误！"
      };
    }
  }
})

/*
 * @route GET api/users/current 
 * @desc 用户信息接口地址 返回用户信息
 * @access 接口是私密的
 */
router.get("/current", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  // console.log(passport);
  ctx.body = {
    id: ctx.state.user.id,
    name: ctx.state.user.name,
    email: ctx.state.user.email,
    avatar: ctx.state.user.avatar,
  }
})

module.exports = router.routes();
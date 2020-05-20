//因为是异步加密 所以暂时废弃
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require("./keys");
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
// const mongoose = require("mongoose"); 
// const User=mongoose.model("user");
const User = require("../models/User");

module.exports = passport => {
  passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }));
}
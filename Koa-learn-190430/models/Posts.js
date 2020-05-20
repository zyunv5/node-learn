const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//实例化模型
const PostSchema = new Schema({
  user: {
    type: String,
    ref: "users",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [{
    user: {
      type: Schema.Types.ObjectId , //拿到user地方的id
      ref: "users"
    }
  }],
  comments: [{
    user: {
      type: Schema.Types.ObjectId , //拿到user地方的id
      ref: "users"
    },
    text: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now
    },
  }],
  date: {
    type: Date,
    default: Date.now
  },
})
module.exports = Post = mongoose.model("post", PostSchema);
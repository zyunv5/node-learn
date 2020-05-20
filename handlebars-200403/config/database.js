if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURL: ""
  }
} else {
  module.exports = {
    mongoURL: "mongodb://localhost/node-app"
  }
}
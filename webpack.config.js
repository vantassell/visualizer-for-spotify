const path = require('path');

module.exports = {
  entry: {
    index: "./src/index.js",
    login: "./src/login.js",
    basic: "./src/player_basic.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
};

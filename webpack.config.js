var path = require('path');

var web = {
  entry: {
    client: path.resolve(__dirname, "app/client.jsx")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel?stage=0'
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};

var node = {
  entry: {
    server: path.resolve(__dirname, "app/server.jsx")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: path.resolve(__dirname, "dist")
  },
  module: {
    loaders: [
      {
        test: /.+\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel?stage=0'
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  target: "node"
};

module.exports = [node, web];

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  proxy: {
    '/graphql': {
      target: 'http://localhost:8080',
      secure: false,
    },
  }
}).listen(8000, function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:' + 8000);
});

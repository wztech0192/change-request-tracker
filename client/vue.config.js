const webpack = require('webpack');

module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete('eslint');

    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        $: 'jquery',
        jquery: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }
    ]);
  },
  devServer: {
    host: 'localhost',

    proxy: {
      '/api': {
        target: 'http://localhost:3333'
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/~weiZ/crt/public/' : '/'
};

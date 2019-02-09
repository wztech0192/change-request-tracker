
module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete('eslint');
  },
  devServer: {
    host: 'localhost',

    proxy: {
      '/api': {
        target: 'http://localhost:3333'
      }
    }
  }
  // publicPath: '/public/'


};

module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete('eslint');
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3333'
      }
    }
  }
};

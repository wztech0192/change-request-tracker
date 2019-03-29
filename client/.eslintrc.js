module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jquery: true
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'never'],
    'max-len': 0,
    'linebreak-style': 0,
    quotes: 0,
    'no-param-reassign': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};

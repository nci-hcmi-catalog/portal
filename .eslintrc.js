module.exports = {
  extends: ['prettier', 'react-app'],
  plugins: ['prettier', 'babel'],
  parser: 'babel-eslint',
  rules: {
    'prettier/prettier': [1, { trailingComma: 'all', singleQuote: true }],
  },
};

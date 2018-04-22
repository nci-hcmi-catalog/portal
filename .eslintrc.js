module.exports = {
  extends: ['prettier', 'react-app'],
  plugins: ['prettier', 'babel'],
  rules: {
    'prettier/prettier': [1, { trailingComma: 'all', singleQuote: true }],
  },
};

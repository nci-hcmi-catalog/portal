module.exports = {
  extends: [
    'prettier',
    'react-app'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [1, { trailingComma: 'all', singleQuote: true }]
  },
};


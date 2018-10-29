module.exports = {
  extends: ['prettier', 'react-app', 'plugin:jsx-a11y/recommended'],
  plugins: ['prettier', 'babel', 'jsx-a11y'],
  parser: 'babel-eslint',
  rules: {
    'prettier/prettier': [1, { trailingComma: 'all', singleQuote: true }],
  },
};

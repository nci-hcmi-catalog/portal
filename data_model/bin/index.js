require('babel-polyfill');
require('@babel/register')({
  presets: ['@babel/preset-env'],
});

let { argv } = require('yargs');

require(`./${argv.script}`);

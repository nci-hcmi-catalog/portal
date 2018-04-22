const { injectBabelPlugin } = require('react-app-rewired');

function rewireEmotion(config, env) {
  return injectBabelPlugin('emotion', config);
}

module.exports = rewireEmotion;

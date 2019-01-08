const { injectBabelPlugin } = require('react-app-rewired');

function rewireEmotion(config, env) {
  config = injectBabelPlugin('emotion', config);
  config = injectBabelPlugin('@babel/plugin-proposal-optional-chaining', config);

  return config;
}

module.exports = rewireEmotion;

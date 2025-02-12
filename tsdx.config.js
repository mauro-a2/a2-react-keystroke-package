// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!

const dotenv = require('rollup-plugin-dotenv');

module.exports = {
    // This function will run for each entry/format/env combination
    rollup(config, options) {
        config.plugins = [
            dotenv.default(),
            ...config.plugins,
        ];
        return config; // always return a config.
    },
};
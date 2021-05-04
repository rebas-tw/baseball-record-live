const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '~~features': path.resolve(__dirname, './src/features'),
    '~~apis': path.resolve(__dirname, './src/apis'),
    '~~utils': path.resolve(__dirname, './src/utils'),
    '~~components': path.resolve(__dirname, './src/common/components'),
    '~~elements': path.resolve(__dirname, './src/common/elements'),
  }),
);

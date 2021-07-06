/* eslint-disable @typescript-eslint/no-require-imports */

if (process.type === 'browser' || process.type === 'main') {
  module.exports = require('./main');
} else {
  module.exports = require('./renderer');
}

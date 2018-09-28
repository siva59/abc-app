const log4js = require('log4js');
log4js.configure({
  appenders: { abc: { type: 'file', filename: 'abc.log' } },
  categories: { default: { appenders: ['abc'], level: 'info' } }
});
 
const logger = log4js.getLogger('abc');
module.exports = logger;
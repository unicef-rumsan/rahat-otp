const config = require('config');

module.exports = async () => config.get('otp.defaultCode');

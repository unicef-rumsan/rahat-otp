/* eslint-disable import/no-dynamic-require */
const config = require('config');

module.exports = async (phone, vendor) => {
  const pin = require(`./${config.get('pin_service')}`);
  return pin(phone.toString(), vendor);
};

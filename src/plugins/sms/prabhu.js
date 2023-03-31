const config = require('config');
const axios = require('axios');
const querystring = require('querystring');

const url = config.get('services.prabhu.url');
const token = config.get('services.prabhu.token');

module.exports = async (phone, message) => {
  if (!phone) throw new Error('No receipent was specified');
  if (!message) throw new Error('No Message was specified');
  // return axios.post(`${url}?token=${token}`, [
  //   {
  //     Message: message,
  //     MobileNumber: phone
  //   }
  // ]);

  const params = querystring.stringify({ to: phone, content: message, token });
  return axios.get(`${url}?${params}`);
};

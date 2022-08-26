/* eslint-disable import/no-dynamic-require */
const config = require('config');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const credsPath = '../../../config/google.json';

module.exports = async (phone, vendor) => {
  const { docId, tabNumber } = config.get('services.gsheet');

  const doc = new GoogleSpreadsheet(docId);
  await doc.useServiceAccountAuth(require(credsPath));
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[tabNumber];
  const rows = await sheet.getRows();
  const row = rows.find(d => d.phone === phone);
  if (!row) return null;
  row.last_used = new Date();
  if (vendor) row.last_vendor = vendor;
  row.save();
  return row.pin;
};

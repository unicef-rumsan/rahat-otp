/* eslint-disable import/no-dynamic-require */
const config = require('config');
const Sequelize = require('sequelize');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { MailService } = require('@rumsan/core/services');
const db = require('./db');

const credsPath = '../../config/google.json';

const model = db.define(
  'pins',
  {
    phone: { type: Sequelize.STRING },
    pin: { type: Sequelize.STRING }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = {
  async syncFromGsheet() {
    const { docId, tabNumber } = config.get('services.gsheet');

    const doc = new GoogleSpreadsheet(docId);
    await doc.useServiceAccountAuth(require(credsPath));
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[tabNumber];
    const rows = await sheet.getRows();
    const data = rows.map(d => ({
      phone: d.phone,
      pin: d.pin
    }));
    await model.destroy({ where: {} });
    await model.bulkCreate(data);
    const res = await model.count();
    MailService.send({
      to: config.get('adminEmail'),
      subject: 'GSheet PIN synced',
      html: `${res} beneficiaries pins synced.`
    });
    return res;
  }
};

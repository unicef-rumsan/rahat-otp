const Sequelize = require('sequelize');
const { db } = require('../../utils');

const model = db.define(
  'pins',
  {
    phone: { type: Sequelize.STRING },
    pin: { type: Sequelize.STRING },
    last_used: { type: Sequelize.STRING },
    last_vendor: { type: Sequelize.STRING }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = async (phone, vendor) => {
  const rec = await model.findOne({ where: { phone } });
  rec.last_used = new Date();
  rec.last_vendor = vendor;
  rec.save();
  return rec.pin;
};

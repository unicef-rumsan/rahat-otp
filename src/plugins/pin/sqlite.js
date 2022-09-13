const Sequelize = require('sequelize');
const { db, getUnixTimestamp } = require('../../utils');

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
  if (!rec) return null;
  console.log('PIN: ', rec.pin);
  rec.last_used = getUnixTimestamp();
  rec.last_vendor = vendor;
  rec.save();
  return rec.pin;
};

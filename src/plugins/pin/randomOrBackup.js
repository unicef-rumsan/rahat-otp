const config = require('config');
const Sequelize = require('sequelize');
const { db, getUnixTimestamp } = require('../../utils');

const model = db.define(
  'otp',
  {
    phone: { type: Sequelize.STRING, allowNull: false, unique: true },
    otp: { type: Sequelize.STRING },
    vendor: { type: Sequelize.STRING },
    expireOn: { type: Sequelize.NUMBER }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = async (phone, vendor) => {
  phone = phone.toString();
  await db.authenticate();
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const payload = { phone, otp, vendor };
  const rec = await model.findOne({ where: { phone } });
  if (!rec) {
    model.create(payload);
  } else {
    if (rec.expireOn) {
      if (getUnixTimestamp() > rec.expireOn) {
        payload.otp = otp;
        payload.expireOn = null;
      } else {
        payload.otp = rec.otp;
      }
    } else {
      payload.otp = config.get('otp.defaultCode');
      payload.expireOn = getUnixTimestamp() + config.get('otp.validDuration');
    }
    model.update(payload, { where: { phone } });
  }
  return payload.otp;
};

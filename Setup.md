# Configs

### config/local.json

Pin Services: random | fixed | ghseet | json | randomOrBackup
SMS Services: goip | prabhu | rumsan | sparrow | twilio

```js
{
  "rahat_server": "http://localhost:3601",
  "private_key": "---",
  "msg": "${otp}: यो राहत कोड दिनुहोला। (काटिने रकम: ${amount})",
  "adminEmail": "---@---.com",
  "db": "./config/rahat-otp.db",
  "otp": {
    "defaultCode": "9670",
    "validDuration": 85000
  },
  "enabled": false,
  "sms_service": "prabhu",
  "pin_service": "random",
  "services": {
    "prabhu": {
      "url": "https://smsml.creationsoftnepal.com/SendBulkV1",
      "token": "[token]"
    },
    "gsheet": {
      "docId": "1JgY0XN1-NUDn1jZdlf1yDfGrWNFthWvaZvZ5rRZ4qzw",
      "tabNumber": 0
    }
  },
  "blockchain": {
    "httpProvider": "http://localhost:8545",
    "webSocketProvider": "ws://localhost:8545"
  }
}
```

### config/mail.json

```js
{
  "disableEmail": false,
  "from": "Rahat OTP Service<---@---.com>",
  "defaultSubject": "Default Subject",
  "transporter": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "pool": true,
    "auth": {
      "user": "---@---.com",
      "pass": "---"
    }
  }
}
```

# Templates

### Google Sheet (gsheet) Template

phone | pin | last_used | last_vendor

### config/pins.json Template

```json
[
  {
    "phone": "9801101234",
    "pin": "9854"
  },
  {
    "phone": "9801104567",
    "pin": "4515"
  }
]
```

# Setup

### play/dbSetup.js

```js
const Sequelize = require('sequelize');
const { db } = require('../src/utils');

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

const run = async () => {
  db.authenticate()
    .then(async () => {
      await db.drop();
      await db.sync();
      console.log('Database reset complete...');
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
};

const test = async () => {
  const rec = await model.findAll();
  console.log(rec[0]);
};

run();
```

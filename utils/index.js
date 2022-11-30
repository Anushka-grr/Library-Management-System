require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URI,
  JWT_key: process.env.JWT_key,
  JWT_LIFETIME: process.env.JWT_LIFETIME,
  ETHEREAL_USER: process.env.ETHEREAL_USER,
  ETHEREAL_PASSWORD: process.env.ETHEREAL_PASSWORD,
  ETHEREAL_SMTP: process.env.ETHEREAL_SMTP,
};

module.exports = config;

require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URI,
};

module.exports = config;

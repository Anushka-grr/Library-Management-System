const mongoose = require("mongoose");
const config = require("../utils");

const connectDB = () => {
  const url = config.mongoUrl;
  if (!url) {
    throw new Error("Mongo uri not found in environemnt vairbale");
  }
  return mongoose.connect(url, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;

const config = require("./utils/index.js");
const express = require("express");
const cookieParser = require("cookie-parser");

const apiRouter = require("./routes");
const connectDB = require("./db/connect");

const app = express();
app.use(express.json());
app.use(express.static("./public"));
app.use(cookieParser("test"));
app.use("/api/v1", apiRouter);

const start = async () => {
  try {
    connectDB();
    app.listen(config.port, () => {
      console.log(`server listening on port ${config.port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();

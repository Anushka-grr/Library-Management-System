const config = require("./utils/index.js");
const express = require("express");
const app = express();
const axios = require("axios");
// routes
const authRouter = require("./routes/authRouter");
const connectDB = require("./db/connect");
// app.use(express.static("./public"));
app.use(express.json());
app.use("/api/v1/auth", authRouter);

// Check IIFE :- Immediately invoked function expression
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

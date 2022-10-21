const config = require("./utils/index.js");
const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const connectDB = require("./db/connect");

const app = express();
app.use(express.json());
app.use(express.static("./public"));
app.use(cookieParser("test"));
app.use(express.urlencoded());
app.use("/api/v1/auth", authRouter);
//user specific page
app.use("/api/v1/", userRouter);

//todo Check IIFE :- Immediately invoked function expression
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

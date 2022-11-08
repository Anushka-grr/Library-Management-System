const authRouter = require("./authRouter");
const bookRouter = require("./bookRouter");
const issueRouter = require("./issueRouter");
const userRouter = require("./userRouter");

const express = require("express");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use("/issue", issueRouter);
router.use("/users", userRouter);

module.exports = router;

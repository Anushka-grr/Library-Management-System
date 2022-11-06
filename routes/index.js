const authRouter = require("./authRouter");
const bookRouter = require("./bookRouter");
const issueRouter = require("./issueRouter");

const express = require("express");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use("/issue", issueRouter);

module.exports = router;

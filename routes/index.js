const bookRouter = require("./bookRouter");
const bookingRouter = require("./bookingRouter");
const userRouter = require("./userRouter");

const express = require("express");
const router = express.Router();

router.use("/books", bookRouter);
router.use("/bookings", bookingRouter);
router.use("/users", userRouter);

module.exports = router;

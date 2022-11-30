const Booking = require("../models/booking");
// const BookingHistory = require("../models/bookingHistory");
const Book = require("../models/books");
const User = require("../models/users");
var moment = require("moment");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const config = require("../utils");

const refreshBooks = async (req, res, next) => {
  try {
    // cron.schedule("*****", async () => {
    const booking = await Booking.find({
      bookedTill: { $lte: moment().toDate() },
    }).populate("bookId");
    //checking if any booking has expired
    booking.forEach(async (booking) => {
      console.log("expired booking found", booking);
      //mailing the users that requested the book
      console.log(booking.bookId, "bhai rahul ne bola ddalne");
      console.log("requested by in refreshBooking", booking.bookId.requestedBy);
      if (booking.bookId.requestedBy.length === 0) {
        return;
      }
      //implement nodemailer
      let transporter = nodemailer.createTransport({
        host: config.ETHEREAL_SMTP,
        port: 587,
        auth: {
          user: config.ETHEREAL_USER,
          pass: config.ETHEREAL_PASSWORD,
        },
      });
      let info = await transporter.sendMail({
        from: "test1 <anushkagaonkar2079@gmail.com>",
        to: "anushkagaonkar2079@gmail.com",
        subject: "Book available ", //BOOK Availabke for booking
        text: "Hello world?", // Hello the book you requested + book title + is available , book fast before it gets issued
        html: "<b>Hello world?</b>",
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Message sent: %s", info);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
    next();
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

module.exports = refreshBooks;

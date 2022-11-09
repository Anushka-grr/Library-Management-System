const Booking = require("../models/bookings");
const cron = require("node-cron");
var moment = require("moment");
const { validateIssueBook } = require("../middleware/validator");

const issueBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    //todo Better take the booking range (range as in the from and to date for the booking. Let's limit the from and to for 4 hours for now.)
    //todo validate the req.body date format
    const { error, value } = validateIssueBook(req.body);
    if (error) {
      console.log("Error in validation of requested dates==>", error);
      return res.status(400).json({ message: `${error}` });
    }
    const requestedDates = value;
    //if bookedTill lesser than bookedFom throw error
    if (requestedDates.bookedTill <= requestedDates.bookedFrom) {
      console.log("Requested dates are ==>", requestedDates);
      return res.status(400).json({
        message: "bookedTill should be greater than or equal to bookedFrom",
      });
    }
    //if book requested for more than 7 days throw error
    const seventhDay = moment(requestedDates.bookedFrom).add(7, "d").format();
    console.log("seventh day", seventhDay);
    if (moment(requestedDates.bookedTill).isAfter(seventhDay)) {
      console.log(" Requested dates are ==>", requestedDates);
      return res
        .status(400)
        .json({ message: "Cannot issue book for more than 7 days" });
    }
    //checking if the book is already issued in the requested time period
    console.log("Requested dates are ==>", requestedDates);
    const booking = await Booking.findOne({ bookId });
    if (booking) {
      console.log(
        `Previous booking valid from ${booking.bookedFrom} to ==>${booking.bookedTill}`
      );
      const invalid = moment(requestedDates.bookedFrom).isBefore(
        booking.bookedTill
      );
      if (invalid) {
        return res.status(200).json({
          message: `Book already issued from ${booking.bookedFrom} to ${booking.bookedTill}`,
        });
      }
    }
    //get username and user id from authenticateUser
    const userId = req.user.userId;
    //registering the booking
    const newBooking = await Booking.create({
      bookId: bookId,
      bookedBy: userId,
      bookedFrom: requestedDates.bookedFrom,
      bookedTill: requestedDates.bookedTill,
    });
    console.log(
      `New booking valid from ${newBooking.bookedFrom} to ==>${newBooking.bookedTill}`
    );
    // TODO: check input for various date formats ,refreshbooks
    // TODO: We can also update the book object, for eg: number of times the book has been issued.
    // TODO: The user can have a my bookings page, where he can see the past bookings as well as the active bookings.
    return res.status(201).json(newBooking);
  } catch (error) {
    res.json({ message: `${error}` });
  }
};
//get all the bookings
const issuedBooks = async (req, res) => {
  const books = await Booking.find({});
  res.status(200).json(books);
};
module.exports = {
  issueBook,
  issuedBooks,
};

//todo when bookedTill date passes , delete booking

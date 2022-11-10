const Booking = require("../models/activeBookings");
const Book = require("../models/books");
const BookingHistory = require("../models/bookingHistory");
const cron = require("node-cron");
var moment = require("moment");
const { validateIssueBook } = require("../middleware/validator");

const issueBook = async (req, res) => {
  try {
    const bookId = req.params.id;
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
      /*error=>
       *currrent booking 25-27  10-14
       *requsted booking 10-15
       */

      if (invalid) {
        return res.status(200).json({
          message: `Book already issued from ${booking.bookedFrom} to ${booking.bookedTill}`,
        });
      }
      //11-12 13-14
      //else push this booking in bookings history model
      // await BookingHistory.create({ booking });
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
    //update the number of times the book is issued
    try {
      var book = await Book.findById(bookId, "issuedCount");
      console.log("original issuedCount value in db", book, book.issuedCount);
      var issuedCount = book.issuedCount;
      issuedCount++;
      console.log("IssuedCount after manipulation", issuedCount);
      await Book.findByIdAndUpdate(bookId, { issuedCount: issuedCount });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        err: {
          code: ``,
          message: `${error}`,
        },
      });
    }

    console.log(
      `New booking valid from ${newBooking.bookedFrom} to ==>${newBooking.bookedTill}`
    );
    // TODO: refreshbooks
    //DONE  TODO: We can also update the book object, for eg: number of times the book has been issued.
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

//todo if book is issued register the request ==>
//aftr every issued set to true, update a counter --> this will show number of ooks issued in 30m dYS, CRON JOB S RESET TO ZERO in 30 days ==> but again, where to store this counter / how to access it

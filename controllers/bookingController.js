const Book = require("../models/books");
const Booking = require("../models/booking");
var moment = require("moment");
const Joi = require("joi");
const validator = require("../utils/validator");
//validation using joi
//booking controller schema
const createBookSchema = Joi.object({
  bookId: Joi.string().alphanum().required(),
  bookedFrom: Joi.date().required().min(moment().format("YYYY-MM-DD")),
  bookedTill: Joi.date().required().max(moment().add(1, "M").format()),
});

const createBooking = async (req, res) => {
  try {
    //get user id and email id from request
    const userId = req.user.userId;
    const emailId = req.user.emailId;
    console.log("emailId", emailId);
    //user can have only 2 active bookings in a month
    const activeBookings = await Booking.find({
      bookedBy: userId,
      bookedTill: { $gte: moment().toDate() },
    });
    console.log(
      `Number of Active Bookings of user ${userId} are => ${activeBookings.length}`
    );
    if (activeBookings.length >= 2) {
      return res
        .status(404)
        .json({ message: "user can have only 2 active bookings at a time" });
    }
    //input validation using joi
    const { error, value } = validator(createBookSchema, req.body);
    // if (error) {
    //   console.log("Error in validation of requested dates==>", error);
    //   return res.status(400).json({ message: `${error}` });
    // }
    const requestedBooking = value;
    console.log(
      "Requested dates are ==>",
      requestedBooking.bookedFrom,
      requestedBooking.bookedTill
    );
    //if bookedTill is before bookedFrom => throw error
    if (requestedBooking.bookedTill <= requestedBooking.bookedFrom) {
      return res.status(400).json({
        message: "bookedTill should be greater than or equal to bookedFrom",
      });
    }
    //if book requested for more than 7 days throw error
    const seventhDay = moment(requestedBooking.bookedFrom).add(7, "d").format();
    console.log("seventh day", seventhDay);
    if (moment(requestedBooking.bookedTill).isAfter(seventhDay)) {
      return res
        .status(400)
        .json({ message: "Cannot issue book for more than 7 days" });
    }
    //checking if the book is already issued in the requested time period
    //getting the active bookings of the requested book
    const booking = await Booking.find({
      bookId: requestedBooking.bookId,
      bookedTill: { $gte: moment().toDate() },
    }).populate("bookId");
    console.log("booking", booking);
    if (booking.length == 0) {
      //Validation completed, Registering the booking
      const newBooking = await Booking.create({
        bookId: requestedBooking.bookId,
        bookedBy: userId,
        bookedFrom: requestedBooking.bookedFrom,
        bookedTill: requestedBooking.bookedTill,
        active: true,
      });
      //update the number of times the book is issued

      console.log(requestedBooking.bookId);
      var book = await Book.findById(requestedBooking.bookId, "issuedCount");
      console.log(book);
      console.log(
        "original issuedCount value in db",
        book
        // book.issuedCount
      );
      var issuedCount = book.issuedCount;
      issuedCount++;
      console.log("IssuedCount after manipulation", issuedCount);
      await Book.findByIdAndUpdate(requestedBooking.bookId, {
        issuedCount: issuedCount,
      });
      //return the new booking
      console.log(
        `New booking valid from ${newBooking.bookedFrom} to ==>${newBooking.bookedTill}`
      );
      return res.status(201).json(newBooking);
    }
    booking.forEach(async (booking) => {
      try {
        console.log(
          `Previous booking valid from ${booking.bookedFrom} to ==>${booking.bookedTill}`
        );
        //checking if requested book from date is between the current booking dates
        const invalidBookedFrom = moment(requestedBooking.bookedFrom).isBetween(
          booking.bookedFrom,
          booking.bookedTill,
          undefined,
          "[]"
        );
        console.log("invalidBookedFrom", invalidBookedFrom);
        //checking if requested book till date is between the current booking dates
        const invalidBookedTill = moment(requestedBooking.bookedTill).isBetween(
          booking.bookedFrom,
          booking.bookedTill,
          undefined,
          "[]"
        );
        console.log("invalidBookedTill", invalidBookedTill);

        if (invalidBookedFrom || invalidBookedTill) {
          //to store the request, save user email id and point the bookid
          console.log("requested book", booking.bookId.bookTitle);
          var requestedBy = booking.bookId.requestedBy;
          console.log("requested by array", requestedBy);
          //check if current users email id is already logged in the request array
          console.log(emailId.toString());
          const includes = requestedBy.includes(emailId);
          if (!includes) {
            console.log("email id already in requested by array", includes);
            requestedBy.push(emailId);
            console.log("updated requested by array", requestedBy);
            const reqBooks = await Book.findOneAndUpdate(
              { bookId: booking.bookId._id.toHexString() },
              {
                requestedBy: requestedBy,
              },
              { new: true }
            );
            console.log("updated book object", reqBooks);
          }
          //return error
          return res.status(200).json({
            message: `Book already issued from ${booking.bookedFrom} to ${booking.bookedTill}`,
          });
        }
        // else
        //Validation completed, Registering the booking
        const newBooking = await Booking.create({
          bookId: requestedBooking.bookId,
          bookedBy: userId,
          bookedFrom: requestedBooking.bookedFrom,
          bookedTill: requestedBooking.bookedTill,
          active: true,
        });
        //update the number of times the book is issued

        console.log(requestedBooking.bookId);
        var book = await Book.findById(requestedBooking.bookId, "issuedCount");
        console.log(book);
        console.log(
          "original issuedCount value in db",
          book
          // book.issuedCount
        );
        var issuedCount = book.issuedCount;
        issuedCount++;
        console.log("IssuedCount after manipulation", issuedCount);
        await Book.findByIdAndUpdate(requestedBooking.bookId, {
          issuedCount: issuedCount,
        });

        //return the new booking
        console.log(
          `New booking valid from ${newBooking.bookedFrom} to ==>${newBooking.bookedTill}`
        );
        return res.status(201).json(newBooking);
        //else end
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
//get all the bookings
const getBookings = async (req, res) => {
  const books = await Booking.find({});
  res.status(200).json(books);
};

module.exports = {
  createBooking,
  getBookings,
};

//todo if book is issued register the request and send a mail when the requested book is free==>
//TODO cron scheduling for refresh

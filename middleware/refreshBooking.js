const Booking = require("../models/bookings");

const refreshBooks = async (req, res, next) => {
  const bookList = await Booking.find({});
  const date = new Date(Date.now());
  //testing by setting date to today for one of the books
  // await Booking.findOneAndUpdate(
  //   { bookId: "63580b4c4aee7eb96084ee94" },
  //   {
  //     bookedTill: date,
  //   }
  // );

  bookList.forEach(async (book) => {
    // TODO: https://momentjs.com/ use this library for date.
    if (book.bookedTill.toDateString() === date.toDateString()) {
      const bookId = book.bookId;
      await Booking.findOneAndDelete({ bookId: bookId });
    }
  });
  next();
};

module.exports = { refreshBooks };

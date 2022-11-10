const Booking = require("../models/activeBookings");
const BookingHistory = require("../models/bookingHistory");
var moment = require("moment");
const cron = require("node-cron");

const refreshBooks = async (req, res, next) => {
  try {
    // cron.schedule("*****", async () => {
    const activeBooking = await Booking.find({});
    console.log("activebookings", activeBooking);
    activeBooking.forEach(async (booking) => {
      // TODO: https://momentjs.com/ use this library for date.

      if (moment(booking.bookedTill).isBefore(moment().format())) {
        console.log("expired booking found", booking);
        // const bookId = booking.bookId;
        await BookingHistory.create({
          bookId: booking.bookId,
          bookedFrom: booking.bookedFrom,
          bookedTill: booking.bookedTill,
          bookedBy: booking.bookedBy,
        });
        console.log(
          "successfully addedd the expired booking in booking history",
          booking
        );
        const history = await BookingHistory.find({});
        console.log("updated booking history ==>", history);
        console.log("deletin...", booking.bookId);
        const deleted = await Booking.deleteOne({ bookId: booking.bookId });
        const bookings = await Booking.find({});
        console.log(
          "succesfully deleted the expired booking, active Bookings Are ==>",
          bookings,
          deleted
        );
      }
    });
    // });
    next();
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

module.exports = { refreshBooks };

//cron
//is before condition bug
//user bookings
// limit bookings per user

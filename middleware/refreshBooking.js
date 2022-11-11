const Booking = require("../models/activeBookings");
const BookingHistory = require("../models/bookingHistory");
var moment = require("moment");
const cron = require("node-cron");

const refreshBooks = async (req, res, next) => {
  try {
    // cron.schedule("*****", async () => {
    const activeBooking = await Booking.find({});
    //checking if any booking has expired
    activeBooking.forEach(async (booking) => {
      if (moment(booking.bookedTill).isBefore(moment().format())) {
        console.log("expired booking found", booking);
        // adding the expired booking in booking history model
        await BookingHistory.create({
          bookId: booking.bookId,
          bookedFrom: booking.bookedFrom,
          bookedTill: booking.bookedTill,
          bookedBy: booking.bookedBy,
        });
        console.log(
          "successfully added the expired booking in booking history",
          booking
        );
        //deleting the expired booking from active bookings
        console.log("deleting...", booking.bookId);
        const deleted = await Booking.deleteOne({ bookId: booking.bookId });
        console.log("succesfully deleted the expired booking ==>", deleted);
      }
    });
    // });
    next();
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

module.exports = { refreshBooks };

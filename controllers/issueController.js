const Booking = require("../models/bookings");
const cron = require("node-cron");

const issueBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    // Better take the booking range (range as in the from and to date for the booking. Let's limit the from and to for 4 hours for now.)

    // While finding the book we just find if the bookedTill overlaps with the current bookedFrom.
    const booking = await Booking.findOne({ bookId });
    if (booking) {
      res.status(200).json({ message: " BOOK ALREADY ISSUED" });
    }
    //get username and user id from authenticateUser
    const userId = req.user.userId;
    const newBooking = await Booking.create({
      bookId: bookId,
      bookedBy: userId,
      bookedTill: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    // TODO: We can also update the book object. for eg: number of times the book has been issued.

    // TODO: The user can have a my bookings page, where he can see the past bookings as well as the active bookings.
    return res.status(201).json(newBooking);
  } catch (error) {
    res.json({ message: `${error}` });
  }
};
module.exports = {
  issueBook,
};

//todo when bookedTill date passes , delete booking
//if book is issued register the request ==> kaha store kru entry
//aftr every issued set to true, update a counter --> this will show number of ooks issued in 30m dYS, CRON JOB S RESET TO ZERO in 30 days ==> but again, where to store this counter / how to access it
//after ever issue , add one more key to the doucment => issuedNUmber, compare to get the most requested book

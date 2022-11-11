const User = require("../models/users");
const Booking = require("../models/activeBookings");
const BookingHistory = require("../models/bookingHistory");

//get id and username of all users in the database
const getAllUsers = async (req, res) => {
  try {
    const user = await User.find({}, "_id username");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      err: {
        code: error,
        message: `${error}`,
      },
    });
  }
};
//get all bookings of the requested user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;
    //validate user
    if (userId != req.user.userId) {
      console.info(`Authorized user ==> ${req.user.userId}  `);
      console.info(`Current User ==> ${userId}`);
      return res.status(400).json({ message: "User Not Authorised" });
    }
    //get active and past bookings
    const activeBookings = await Booking.find({ bookedBy: userId });
    const pastBookings = await BookingHistory.find({ bookedBy: userId });
    console.log(
      `Active Bookings are => ${activeBookings}, Past Bookings are => ${pastBookings}`
    );
    // creating an object with current and past bookings of user and the user's id
    const userBookings = {
      userId: userId,
      activeBookings: activeBookings,
      pastBookings: pastBookings,
    };
    if (
      userBookings.activeBookings.length == 0 &&
      userBookings.pastBookings.length == 0
    ) {
      return res.status(404).json({ message: "NO BOOKING HISTORY FOUND" });
    }
    res.status(200).json(userBookings);
  } catch (error) {
    res.status(500).json({ err: { code: ``, message: `${error}` } });
  }
};
module.exports = { getAllUsers, getUserBookings };

//TODO: limit the number of books a user can issue

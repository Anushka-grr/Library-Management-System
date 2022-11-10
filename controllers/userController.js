const User = require("../models/users");

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
const getUserBookings = async (req, res) => {};
module.exports = { getAllUsers };

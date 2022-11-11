const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserBookings,
} = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authenticate");

router.route("/").get(getAllUsers);
router.route("/:id").get(authenticateUser, getUserBookings);

module.exports = router;

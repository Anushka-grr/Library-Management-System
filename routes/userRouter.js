const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getAllUsers,
  getUserBookings,
} = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authenticate");

router.post("/login", login);
router.post("/register", register);
router.route("/").get(getAllUsers);
router.route("/:id").get(authenticateUser, getUserBookings);

module.exports = router;

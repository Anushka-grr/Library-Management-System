const { Router } = require("express");
const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
} = require("../controllers/bookingController");
const { authenticateUser } = require("../middleware/authenticate");
const refreshBooks = require("../middleware/refreshBooking");

router
  .route("/")
  .get(getBookings)
  .post(authenticateUser, refreshBooks, createBooking);
module.exports = router;

/**
 * REST API Structure 
 * 
 * ENDPOINT             METHOD          DESCRIPTION

 * /api/v1/book         GET             Get all Books
 * /api/v1/book         POST            Create new Book
 * /api/v1/book/:id     GET             Get book with this id
 * /api/v1/book/:id     PUT/PATCH/POST  Update book with this id
 * /api/v1/book/:id     DELETE          Delete book with this id
 */

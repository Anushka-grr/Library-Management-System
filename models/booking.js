const { boolean } = require("joi");
const mongoose = require("mongoose");
const Book = require("../models/books");
const User = require("../models/users");

// , bookTitle ,genre, author , publisher , edition, isbn ,issued
const BookingSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  }, // will point to the book
  bookedFrom: {
    type: Date,
    required: true,
  },
  bookedTill: {
    type: Date,
    required: true,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, //  Will point to the user who created this booking
});

module.exports = mongoose.model("Booking", BookingSchema);

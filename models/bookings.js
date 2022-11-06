const mongoose = require("mongoose");

// , bookTitle ,genre, author , publisher , edition, isbn ,issued
const BookingSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  }, // will point to the book
  bookedTill: {
    type: Date,
  },
  bookedBy: {
    type: String,
  }, //  Will point to the user who created this booking
});

module.exports = mongoose.model("Booking", BookingSchema);

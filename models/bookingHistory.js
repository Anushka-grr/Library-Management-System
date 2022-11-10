const mongoose = require("mongoose");

// , bookTitle ,genre, author , publisher , edition, isbn ,issued
const BookingHistorySchema = new mongoose.Schema({
  bookId: {
    type: String,
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
    type: String,
    required: true,
  }, //  Will point to the user who created this booking
});

module.exports = mongoose.model("BookingHistory", BookingHistorySchema);

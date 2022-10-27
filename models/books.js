const mongoose = require("mongoose");

// , bookTitle ,genre, author , publisher , edition, isbn ,issued
const BookSchema = new mongoose.Schema({
  isbn: {
    type: Number,
    maxLength: [8, "use upto 8 characters"],
    unique: true,
    required: true,
  },
  genre: {
    type: String,
    trim: true,
    enum: ["Fantasy", "Sci-Fi", "Mystery", "Thriller", "Romance"],
  },
  author: {
    type: String,
  },
  publisher: {
    type: String,
  },
  bookTitle: {
    type: String,
    required: true,
  },
  edition: {
    type: Number,
    maxLength: [10, "use upto 10 characters"],
  },
  issued: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Book", BookSchema);

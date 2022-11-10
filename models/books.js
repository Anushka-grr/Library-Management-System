const mongoose = require("mongoose");
const genreArray = new mongoose.Schema({
  genre: {
    type: String,
    trim: true,
    enum: ["Fantasy", "Sci-Fi", "Mystery", "Thriller", "Romance"],
  },
});

// , bookTitle ,genre, author , publisher , edition, isbn ,issued
const BookSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
  },
  isbn: {
    type: Number,
    min: 10000000,
    max: 99999999,
    unique: true,
    required: [true, "isbn required"],
  },
  genreArray: [genreArray],
  author: {
    type: String,
  },
  publisher: {
    type: String,
  },
  bookTitle: {
    type: String,
    required: [true, "Book Title Cannot be empty"],
  },
  edition: {
    type: Number,
    max: [99999, "use upto 5 characters"],
    default: 1,
  },
  issued: {
    type: Boolean,
    default: false,
  },
  issuedCount: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("Book", BookSchema);

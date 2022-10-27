//postBooks, getAllBooks , getBook
const Book = require("../models/books");

// bookTitle ,genre, author , publisher , edition, isbn ,issued
const postBooks = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).send({ book });
  } catch (error) {
    res.status(400).json({
      err: {
        code: error,
        message: `${error}`,
      },
    });
  }
};
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    console.log(req.params);
    res.status(200).json({ books });
  } catch (error) {
    res.status(404).json({
      err: {
        code: error,
        message: `${error}`,
      },
    });
  }
};
const getBook = async (req, res) => {
  try {
    const bookParameter = req.body;
    //get by id
    if (bookParameter._id) {
      const book = await Book.findOne({ _id: bookParameter._id });

      res.status(200).json({ book });
    }
    //get by isbn
    if (bookParameter.isbn) {
      const book = await Book.findOne({ isbn: bookParameter.isbn });

      res.status(200).json({ book });
    }
    //get by multiple queries
    const book = await Book.find(bookParameter);
    if (book.length <= 0) {
      res.status(404).json({ message: "NO BOOK FOUND" });
    }
    res.status(200).json({ book });
  } catch (error) {
    res.status(404).json({
      err: {
        code: error,
        message: `${error}`,
      },
    });
  }
};
module.exports = {
  postBooks,
  getAllBooks,
  getBook,
};

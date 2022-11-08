//postBooks, getAllBooks , getBook
const { db } = require("../models/books");
const Book = require("../models/books");
const Booking = require("../models/bookings");
const User = require("../models/users");

const {
  validatePostBook,
  validateEditBook,
  validateGetBook,
} = require("../middleware/validator");
// bookTitle ,genre, author , publisher , edition, isbn ,issued
const postBooks = async (req, res) => {
  try {
    //validating using joi
    const { error, value } = validatePostBook(req.body);
    if (error) {
      return res.status(400).json({ message: `${error}` });
    }
    //pointing to the user that created this book
    value.createdBy = req.user.userId;
    const book = await Book.create(value);
    res.status(201).send(book);
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

/**
 * We have 3 variations
 * 1. get by id
 * 2. get by isbn
 * 3. get by anything else (title, genre, etc or union of [title,genre,etc])
 */
const getBook = async (req, res) => {
  try {
    const { error, value } = validateGetBook(req.body);
    if (error) {
      return res.status(400).json({ message: `${error}` });
    }
    const bookParameter = value;
    //custom error for when no book matches the search
    function noBook(bookLength) {
      if (bookLength == 0 || bookLength == null) {
        return res.status(404).json({ message: "NO BOOK FOUND" });
      }
    }
    //get by id
    if (bookParameter._id || bookParameter.isbn || bookParameter.bookTitle) {
      const book = await Book.findOne(bookParameter);
      noBook(book);
      return res.status(200).json(book);
    }
    //get by multiple queries , gets only the id, isbn and title of book
    const book = await Book.find(bookParameter, "_id isbn bookTitle");
    noBook(book.length);
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      err: {
        code: error,
        message: `${error}`,
      },
    });
  }
};
const editBook = async (req, res) => {
  try {
    const id = req.params.id;
    const { error, value } = validateEditBook(req.body);
    if (error) {
      return res.status(400).json({
        message: `${error}`,
      });
    }
    const updateBook = value;
    // User x should not be able to update books created by user y.
    const checkUser = await Book.findOne({ _id: id });

    if (checkUser.createdBy != req.user.userId) {
      console.info(`Authorized user ==> ${req.user.userId}  `);
      console.info(`Current User ==> ${checkUser.createdBy}`);

      return res.status(401).json({ message: "User Not Authorised" });
    }

    const book = await Book.findOneAndUpdate({ _id: id }, updateBook, {
      returnDocument: "after", // Will return the new document
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      err: {
        code: error,
        message: `${error}`,
      },
    });
  }
};

const getBookStats = async (req, res) => {
  const issuedBooks = await Booking.find({});
  const allBooks = await Book.find({});
  const users = await User.find({});
  // todo {total borrowed books in last 30 days,most borrowed book in last 30 days, most requested book (of all times)}
  //todo clean the data in db
  const result = {
    issuedBooks: issuedBooks.length,
    allBooks: allBooks.length,
    users: users.length,
  };
  res.status(200).json(result);
};

module.exports = {
  postBooks,
  getAllBooks,
  getBook,
  editBook,
  getBookStats,
};

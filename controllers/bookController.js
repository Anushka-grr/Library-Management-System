const { db } = require("../models/books");
const Book = require("../models/books");
const Booking = require("../models/booking");
const User = require("../models/users");
const Joi = require("joi");
const validator = require("../utils/validator");
var moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
//validating inputs using JOI
//bookController Schemas
const bookSchema = Joi.object({
  _id: Joi.string().alphanum().max(24).min(24),
  isbn: Joi.number().min(10000000).max(99999999),
  genreArray: Joi.array().items(
    Joi.object({
      genre: Joi.string().valid(
        "Fantasy",
        "Sci-Fi",
        "Mystery",
        "Thriller",
        "Romance"
      ),
    }).required()
  ),
  author: Joi.string(),
  publisher: Joi.string(),
  bookTitle: Joi.string(),
  edition: Joi.number().max(99999),
});
//creating a different schema for post book because it should ALWAYS contain the Book Title field
const postBookSchema = Joi.object({
  _id: Joi.string().alphanum().max(24).min(24),
  isbn: Joi.number().min(10000000).max(99999999),
  genreArray: Joi.array().items(
    Joi.object({
      genre: Joi.string().valid(
        "Fantasy",
        "Sci-Fi",
        "Mystery",
        "Thriller",
        "Romance"
      ),
    }).required()
  ),
  author: Joi.string(),
  publisher: Joi.string(),
  bookTitle: Joi.string().required(),
  edition: Joi.number().max(99999),
});
//bookController functions
const postBooks = async (req, res) => {
  try {
    //validating using joi
    const { error, value } = validator(postBookSchema, req.body);
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
 * 1. get by id => returns a single unique document
 * 2. get by isbn => returns a single unique document
 * 3. get by anything else (title, genre, etc or union of [title,genre,etc]) => returns all documents that match the filter
 */
const getBook = async (req, res) => {
  try {
    const { error, value } = validator(bookSchema, req.body);
    if (error) {
      return res.status(400).json({ message: `${error}` });
    }
    const bookParameter = value;
    console.log("value", value);
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
    const { error, value } = validator(bookSchema, req.body);
    console.log(value);
    if (error) {
      return res.status(400).json({
        message: `${error}`,
      });
    }
    const updateBook = value;
    let bookId = req.params.id;
    console.log(bookId, typeof bookId);
    // bookId = bookId;
    // const id = new ObjectId(bookId);
    // console.log("id", id);
    // User x should not be able to update books created by user y.
    let checkBook = await Book.findOne({ _id: bookId });
    console.log(
      "checkUSer",
      checkBook,

      req.user.userId
    );
    checkUser = checkBook.createdBy.toHexString();
    if (checkUser !== req.user.userId) {
      console.log(checkUser);
      console.info(`Authorized user ==> ${req.user.userId}  `);
      console.info(`Current User ==> ${checkBook.createdBy}`);
      return res.status(401).json({ message: "User Not Authorised to Edit" });
    }
    const book = await Book.findOneAndUpdate(
      { _id: checkBook._id },
      updateBook,
      {
        returnDocument: "after", // Will return the new document
      }
    );
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
const getBookStats = async (req, res) => {
  const issuedBooks = await Booking.find({
    bookedTill: { $gte: moment().toDate() },
  });
  const allBooks = await Book.find({}, "_id bookTitle issuedCount");
  const users = await User.find({});
  var mostRequestedBook = [];
  //most requested book of all times
  var count = 0;
  allBooks.forEach((book) => {
    var i = 0;
    if (book.issuedCount > count) {
      count = book.issuedCount;
      mostRequestedBook = [];
      mostRequestedBook[0] = book;
      i++;
    } else if (book.issuedCount == count) {
      mostRequestedBook[i] = book;
      i++;
    }
  });
  const result = {
    issuedBooks: issuedBooks.length,
    allBooks: allBooks.length,
    users: users.length,
    mostRequestedBook: mostRequestedBook,
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

//TODO: In getBookStats => {total borrowed books in last 30 days,most borrowed book in last 30 days, }
//TODO: clean the data in db

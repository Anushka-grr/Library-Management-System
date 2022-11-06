//postBooks, getAllBooks , getBook
const { db } = require("../models/books");
const Book = require("../models/books");

// bookTitle ,genre, author , publisher , edition, isbn ,issued
const postBooks = async (req, res) => {
  try {
    //todo https://www.npmjs.com/package/joi
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
    // Intead of querying and responding from the if blocks better to create an options Object which will have the optins that is required to pass to the mongo find function
    // this we we ensure that we do not respond back ambiguoisuly from any if block and maintain code consistency
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
const editBook = async (req, res) => {
  const id = req.params.id;
  const updateBook = req.body;
  console.log(updateBook);

  //User x should not be able to update books created by user y. (Admins or the user who created the book can only update the book).
  //https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/
  const book = await Book.findOneAndUpdate({ _id: id }, updateBook, {
    returnDocument: true, // Will return the new document
  });
  await res.status(200).json(book);
};

const getBookStats = async (req, res) => {
  // const issuedBooks = await Book.count({ issued: true });

  // const totalBooks = await Book.count({});

  // Get all the books
  const allBooks = await Book.find({}, "issued");

  // Only get those books who have been issued
  const issuedBooks = allBooks.filter((b) => b.issued);

  const result = {
    issuedBooks: issuedBooks.length,
    allBooks: allBooks.length,
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

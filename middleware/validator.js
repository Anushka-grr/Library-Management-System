const Joi = require("joi");
var moment = require("moment");
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });
//user model validator schema
const userSchema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9_.]*$"))
    .min(3)
    .max(10)
    .required(),
  password: Joi.string()
    // .pattern(new RegExp("^[a-zA-Z0-9@_#]$"))
    .min(3)
    .max(10)
    .required(),
});
const registerSchema = userSchema;
const loginSchema = userSchema;

//books model validator schema
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
const getBookSchema = bookSchema;
const editBookSchema = bookSchema;
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
//booking model validator schema
const issueBookSchema = Joi.object({
  bookedFrom: Joi.date().required().min(moment().format("YYYY-MM-DD")),
  bookedTill: Joi.date().required().max(moment().add(1, "M").format()),
});

exports.validateLogin = validator(loginSchema);
exports.validateRegister = validator(registerSchema);
exports.validateGetBook = validator(getBookSchema);
exports.validateEditBook = validator(editBookSchema);
exports.validatePostBook = validator(postBookSchema);
exports.validateIssueBook = validator(issueBookSchema);

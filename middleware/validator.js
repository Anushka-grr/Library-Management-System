const Joi = require("joi");
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });
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
  bookTitle: Joi.string().required(),
  edition: Joi.number().max(99999),
});

const registerSchema = userSchema;
const loginSchema = userSchema;
const getBookSchema = bookSchema;
const editBookSchema = bookSchema;
const postBookSchema = bookSchema;

exports.validateLogin = validator(loginSchema);
exports.validateRegister = validator(registerSchema);
exports.validateGetBook = validator(getBookSchema);
exports.validateEditBook = validator(editBookSchema);
exports.validatePostBook = validator(postBookSchema);

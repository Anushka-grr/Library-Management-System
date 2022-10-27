const express = require("express");
const router = express.Router();
const {
  postBooks,
  getAllBooks,
  getBook,
} = require("../controllers/bookController");

router.route("/").post(postBooks).get(getAllBooks);
router.route("/search").get(getBook);

module.exports = router;

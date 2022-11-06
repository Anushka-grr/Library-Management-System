const express = require("express");
const router = express.Router();
const {
  postBooks,
  getAllBooks,
  getBook,
  editBook,
  getBookStats,
} = require("../controllers/bookController");

router.route("/").post(postBooks).get(getAllBooks);
router.route("/search").get(getBook);
router.route("/:id").patch(editBook);
router.route("/inventory").get(getBookStats);

module.exports = router;

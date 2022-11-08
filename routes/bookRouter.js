const express = require("express");
const router = express.Router();
const {
  postBooks,
  getAllBooks,
  getBook,
  editBook,
  getBookStats,
} = require("../controllers/bookController");
const { authenticateUser } = require("../middleware/authenticate");

router.route("/").post(authenticateUser, postBooks).get(getAllBooks);
router.route("/search").get(getBook);
router.route("/:id").patch(authenticateUser, editBook);
router.route("/inventory").get(getBookStats);

module.exports = router;

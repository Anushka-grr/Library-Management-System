const { Router } = require("express");
const express = require("express");
const router = express.Router();
const { issueBook, issuedBooks } = require("../controllers/issueController");
const { authenticateUser } = require("../middleware/authenticate");
const { refreshBooks } = require("../middleware/refreshBooking");

router.route("/:id").post(authenticateUser, refreshBooks, issueBook);
router.route("/").get(issuedBooks);
module.exports = router;

const express = require("express");
const router = express.Router();
const { user } = require("../controllers/userController");

router.get("/:id", user);

module.exports = router;

const express = require("express");
const {
  getAllBooks,
  getOneBook,
  createBook,
} = require("../controllers/book.controllers");
const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getOneBook);

router.post("/", createBook);

module.exports = router;

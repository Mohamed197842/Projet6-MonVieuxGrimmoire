const express = require("express");
const {
  getAllBooks,
  getOneBook,
  createBook,
  modifyBook,
  deleteBook,
} = require("../controllers/book.controllers");
const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getOneBook);

router.post("/", createBook);

router.put("/:id", modifyBook);

router.delete("/:id", deleteBook);

module.exports = router;

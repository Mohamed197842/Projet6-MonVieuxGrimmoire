const express = require("express");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const {
  getAllBooks,
  getOneBook,
  getBestRating,
  createBook,
  modifyBook,
  deleteBook,
  postRating,
} = require("../controllers/book.controllers");
const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getOneBook);
router.get("/bestrating", getBestRating);

router.post("/", auth, multer, createBook);
router.post("/:id/rating", auth, postRating);

router.put("/:id", auth, multer, modifyBook);

router.delete("/:id", auth, deleteBook);

module.exports = router;

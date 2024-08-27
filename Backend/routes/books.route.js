const express = require("express");
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

// importer les middlewares qui vont etre utilisé dans la configuration des routes books
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const sharp = require("../middlewares/sharp");

router.get("/", getAllBooks);
router.get("/:id", getOneBook);
router.get("/bestrating", getBestRating);

router.post("/", auth, multer, sharp, createBook);
router.post("/:id/rating", auth, postRating);

router.put("/:id", auth, multer, sharp, modifyBook);

router.delete("/:id", auth, deleteBook);

module.exports = router;

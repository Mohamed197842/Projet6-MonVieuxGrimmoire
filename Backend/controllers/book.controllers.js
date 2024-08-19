const Book = require("../models/book");
const path = require("path");
const fs = require("fs");

//liste de tout les livres
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// un seul livres
const getOneBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// les 3 trois livres les meiux notées
const getBestRating = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3); // Seulement 3 livres
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un livre
const createBook = async (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.compressedFilename
      }`,
      averageRating: bookObject.ratings[0].grade,
    });

    await book.save();
    res.status(201).json({ message: "Livre enregistré !" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Modifier un livre
const modifyBook = async (req, res) => {
  // Créez l'objet de mise à jour du livre
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`, // Assurez-vous que le chemin est correct
      }
    : { ...req.body };

  // Supprimez les propriétés non nécessaires
  delete bookObject._userId;

  // Mettez à jour le livre
  Book.findOneAndUpdate(
    { _id: req.params.id },
    { ...bookObject, _id: req.params.id },
    { new: true } // Retourner le document modifié
  )
    .then((updatedBook) => {
      if (!updatedBook) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérifiez si l'utilisateur a les droits pour modifier le livre
      if (updatedBook.userId != req.auth.userId) {
        return res.status(403).json({ message: "403: demande non autorisée" });
      }

      // Supprimez l'ancienne image si une nouvelle image est téléchargée
      if (req.file && updatedBook.imageUrl) {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          path.basename(updatedBook.imageUrl)
        );
        fs.unlink(imagePath, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }

      res.status(200).json({ message: "Livre modifié!", book: updatedBook });
    })
    .catch((error) => res.status(400).json({ error }));
};

// Supprimer un livre

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Trouvez le livre à supprimer
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérifiez si l'utilisateur a les droits pour supprimer le livre
    if (book.userId != req.auth.userId) {
      return res.status(403).json({ message: "403: demande non autorisée" });
    }

    // Supprimez l'image associée
    if (book.imageUrl) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(book.imageUrl)
      );
      fs.unlink(imagePath, (error) => {
        if (error) {
          console.error("Erreur lors de la suppression de l'image:", error);
        } else {
          console.log("Image supprimée avec succès!");
        }
      });
    }

    // Supprimez le livre de la base de données
    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: "Livre supprimé avec succès!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getOneBook,
  getBestRating,
  createBook,
  modifyBook,
  deleteBook,
};

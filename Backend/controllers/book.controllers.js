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
  try {
    // Créez l'objet de mise à jour du livre
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`, // Assurez-vous que le chemin est correct
        }
      : { ...req.body };

    // Supprimez les propriétés non nécessaires
    delete bookObject._userId;

    // Trouvez le livre à mettre à jour
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérifiez si l'utilisateur a les droits pour modifier le livre
    if (book.userId != req.auth.userId) {
      return res.status(403).json({ message: "403: demande non autorisée" });
    }

    // Supprimez l'ancienne image si une nouvelle image est téléchargée
    if (req.file && book.imageUrl) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(book.imageUrl)
      );
      fs.unlink(imagePath, (error) => {
        if (error) {
          console.error("Erreur lors de la suppression de l'image:", error);
        }
      });
    }

    // Mettez à jour le livre
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { ...bookObject, _id: req.params.id },
      { new: true } // Retourner le document modifié
    );

    res.status(200).json({ message: "Livre modifié!", book: updatedBook });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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

// Fonction pour ajouter une note à un livre
const postRating = async (req, res) => {
  try {
    const { userId, rating } = req.body;

    // Vérifie que l'utilisateur est authentifié
    if (userId !== req.auth.userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    // Vérifie que la note est entre 0 et 5
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ error: "La note doit être comprise entre 0 et 5." });
    }

    // Recherche du livre par ID
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Livre non trouvé." });
    }

    // Vérifie si l'utilisateur a déjà noté ce livre
    const existingRating = book.ratings.find((r) => r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
    }

    // Ajout de la note dans le tableau des évaluations
    book.ratings.push({ userId, grade: rating });

    // Mise à jour de la note moyenne
    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = sumRatings / totalRatings;

    // Sauvegarde du livre mis à jour
    const updatedBook = await book.save();
    return res.status(200).json(updatedBook);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getOneBook,
  getBestRating,
  createBook,
  modifyBook,
  deleteBook,
  postRating,
};

const mongoose = require("mongoose");

// Utilisez 'new mongoose.Schema()' pour créer un nouveau schéma
const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID de l'utilisateur qui a ajouté le livre
  title: { type: String, required: true }, // Titre du livre
  author: { type: String, required: true }, // Auteur du livre
  imageUrl: { type: String, required: true }, // URL de l'image du livre
  year: { type: Number, required: true }, // Année de publication du livre
  genre: { type: String, required: true }, // Genre du livre
  ratings: [
    {
      userId: { type: String, required: true }, // ID de l'utilisateur qui a noté le livre
      grade: { type: Number, required: true }, // Note donnée par l'utilisateur
    },
  ],
  averageRating: { type: Number, required: true }, // Note moyenne du livre
});

// Exportation du modèle Book basé sur le schéma
module.exports = mongoose.model("Book", bookSchema);

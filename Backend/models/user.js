const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Ce plugin Mongoose est utilisé pour garantir l'unicité des adresses utilisés et signaler les erreurs
userSchema.plugin(uniqueValidator);

// Exportation du modèle User basé sur le schéma
module.exports = mongoose.model("User", userSchema);

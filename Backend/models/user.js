const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Ce plugin Mongoose approprié est utilisé pour garantir l'unicité et signaler les erreurs
userSchema.plugin(uniqueValidator);

// Exportation du modèle Book basé sur le schéma
module.exports = mongoose.model("user", userSchema);

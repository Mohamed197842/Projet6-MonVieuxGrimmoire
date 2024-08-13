const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Exportation du modèle Book basé sur le schéma
module.exports = mongoose.model("user", userSchema);

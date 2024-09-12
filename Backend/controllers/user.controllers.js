const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config(); // Charge les variables d'environnement

// Ajoute le log pour vérifier si la variable est bien chargée
console.log("Secret Token:", process.env.SECRET_TOKEN);

// Fonction pour l'inscription
exports.signUp = async (req, res) => {
  try {
    // Hachage du mot de passe
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
    });

    // Sauvegarde de l'utilisateur
    await user.save();
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    // Message d'erreur plus générique
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur." });
  }
};

// Fonction pour la connexion
exports.login = async (req, res) => {
  try {
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // Si l'utilisateur n'est pas trouvé
      return res
        .status(401)
        .json({ message: "Paire identifiant/mot de passe incorrecte" });
    }

    // Comparaison du mot de passe
    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      // Si le mot de passe est incorrect
      return res
        .status(401)
        .json({ message: "Paire identifiant/mot de passe incorrecte" });
    }

    // Si l'authentification est réussie
    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
        expiresIn: "24h",
      }),
    });
  } catch (error) {
    // Message d'erreur plus générique
    res.status(500).json({ error: "Erreur lors de la connexion." });
  }
};

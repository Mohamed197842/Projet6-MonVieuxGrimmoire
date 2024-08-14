const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10); // Hachage du mot de passe
    const user = new User({
      email: req.body.email,
      password: hash,
    });

    await user.save(); // Enregistrement de l'utilisateur
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

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
      token: jwt.sign({ userId: user._id }, "RANDOM_SECRET_TOKEN", {
        expiresIn: "24h",
      }),
    });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ error });
  }
};

const jwt = require("jsonwebtoken");

// Middleware qui vérifie et valide le JWT
module.exports = (req, res, next) => {
  try {
    // Vérifier si l'en-tête d'autorisation est présent
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "En-tête d'autorisation manquant" });
    }

    // Séparer le token de l'en-tête
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    // Vérifier le token en utilisant la clé secrète
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId;

    // Attacher l'ID utilisateur à l'objet de requête
    req.auth = { userId };
    next();
  } catch (error) {
    // Retourner une erreur 403 si le token est invalide ou expiré
    res.status(403).json({ message: "Token invalide ou expiré" });
  }
};

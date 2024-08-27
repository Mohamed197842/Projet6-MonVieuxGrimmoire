const sharp = require("sharp");
const fs = require("fs");

// Middleware pour compresser l'image téléchargée au format webp et la redimensionner
module.exports = async (req, res, next) => {
  // Vérifie si un fichier image a été téléchargé
  if (!req.file) {
    return next(); // Si aucun fichier n'est téléchargé, passer au middleware suivant
  }

  try {
    // Création du nom de fichier + chemin pour la version compressée
    req.file.compressedFilename = req.file.filename + ".webp";
    req.file.compressedFilePath = req.file.path + ".webp";

    // Utilisation de sharp pour redimensionner l'image à 500x500 pixels, la convertir au format webp
    // et la sauvegarder sous le nouveau chemin
    await sharp(req.file.path)
      .resize(500, 500)
      .webp(90)
      .toFile(req.file.compressedFilePath);

    // Si la compression réussit, supprimer l'image originale
    fs.unlink(req.file.path, (error) => {
      if (error) console.log(error);
    });
    next();
  } catch (error) {
    res.status(403).json({ error });
  }
};

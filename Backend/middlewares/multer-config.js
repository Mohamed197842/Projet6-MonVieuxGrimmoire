const multer = require("multer");

// Types MIME pour les images avec leurs extensions
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/png": "png",
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  // Définir le répertoire de destination des fichiers uploadés
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Définir le nom du fichier
  filename: (req, file, callback) => {
    // Remplacer les espaces par des underscores dans le nom du fichier
    const name = file.originalname.split(" ").join("_");
    // Obtenir l'extension basée sur le type MIME
    const extension = MIME_TYPES[file.mimetype];
    // Générer le nom final du fichier avec un timestamp pour éviter les conflits
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exporter la configuration multer pour l'utiliser dans les routes
module.exports = multer({ storage: storage }).single("image");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const mongoSanitize = require("mongo-sanitize");
const helmet = require("helmet").default;
const app = express();

// Routes
const bookRoutes = require("./routes/books.route.js");
const userRoutes = require("./routes/user.route.js");

// Charger les variables d'environnement depuis un fichier .env
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// Connexion à MongoDB via Mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Middleware pour configurer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Middleware pour analyser le corps des requêtes en JSON
app.use(express.json());

// Middleware pour sécuriser les en-têtes HTTP
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Routes pour les livres et les utilisateurs
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

// Configuration d'un point d'accès pour gérer les requêtes vers le répertoire 'images'
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;

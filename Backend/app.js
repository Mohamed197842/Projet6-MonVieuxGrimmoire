const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Book = require("./models/book.js");
const bookRoutes = require("./routes/books.route.js");

// Load environment variables from a .env file
require("dotenv").config();

// Récupération des informations de connexion à la base de données depuis les variables d'environnement
const dataServer = process.env.DB_SERVER;
const dataUserName = process.env.DB_USER_NAME;
const dataPassword = process.env.DB_PASSWORD;

// Connexion à MongoDB via Mongoose
mongoose
  .connect(
    // Chaîne de connexion à MongoDB Atlas, en utilisant les informations d'identification stockées
    "mongodb+srv://Admin00:8HqQXYDS89CBDdry@cluster0.zpvrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  // Gestion de la promesse retournée par la connexion à MongoDB
  .then(() => console.log("Connexion à MongoDB réussie !")) // Si la connexion réussit
  .catch(() => console.log("Connexion à MongoDB échouée !")); // Si la connexion échoue

// Middleware pour configurer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  // Permet les méthodes HTTP spécifiques
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  next();
});

// Middleware used to analyze the body of incoming requests in JSON format
app.use(express.json());

//Routes
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Hello from node server !");
});

module.exports = app;

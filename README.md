# Mon Vieux Grimoire

Mon Vieux Grimoire est une application web qui permet aux utilisateurs de noter et de commenter des livres.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [Node.js](https://nodejs.org/en/download/) (v14+ recommandé)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) pour la gestion des dépendances


## Dépendances

Avec la commande "npm install"

Voici les dépendances principales utilisées dans le projet : 

- `bcrypt` / `bcryptjs` : Hachage des mots de passe
- `dotenv` : Gestion des variables d'environnement
- `express` : Framework web minimaliste pour créer le serveur
- `jsonwebtoken` : Gestion des tokens JWT pour l'authentification
- `mongodb` : Base de données NoSQL MongoDB
- `mongoose` : Gestion des schémas et modèles MongoDB
- `mongoose-unique-validator` : Validation d'unicité pour les schémas Mongoose
- `multer` : Gestion des uploads de fichiers
- `sharp` : Traitement des images (redimensionnement, compression)
- `nodemon` : Outil de développement pour redémarrer automatiquement le serveur lors de modifications

  ## Lancer l'application

1. Démarrez le serveur en mode développement avec la commande `nodemon` :

```bash
nodemon server

Le serveur sera lancé par défaut sur http://localhost:4000.

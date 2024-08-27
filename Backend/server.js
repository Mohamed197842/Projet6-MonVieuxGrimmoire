const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Configurez les ports sur lesquels vous souhaitez écouter
const port1 = normalizePort(process.env.PORT1 || "3000");
const port2 = normalizePort(process.env.PORT2 || "4000");

app.set("port", port1); // ou "port", port2 si vous avez besoin d'utiliser ce réglage ailleurs

const errorHandler = (error, port) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Créez une fonction pour démarrer un serveur sur un port spécifique
const createServerOnPort = (port) => {
  const server = http.createServer(app);

  server.on("error", (error) => errorHandler(error, port));
  server.on("listening", () => {
    const address = server.address();
    const bind =
      typeof address === "string" ? "pipe " + address : "port " + port;
    console.log("Listening on " + bind);
  });

  server.listen(port);
};

// Démarrez le serveur sur le port
createServerOnPort(port2);

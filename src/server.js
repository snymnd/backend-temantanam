const Hapi = require("@hapi/hapi");
const dotenv = require("dotenv");
const firebaseAuth = require("./lib/firebaseAuth");
const home = require("./plugins/home");
const auth = require("./plugins/auth");
const user = require("./plugins/user");
const plant = require("./plugins/plant");
const collection = require("./plugins/collection");
const history = require("./plugins/history");
dotenv.config();

// Create Server
const server = Hapi.server({
  port: process.env.PORT || 8000,
  host: "localhost",
  routes: {
    cors: {
      origin: ["*"],
    },
  },
});

async function createServer() {
  // Register firebaseAuth plugin
  await server.register(firebaseAuth);
  // Initialize the firebase auth strategy and set to default auth
  server.auth.strategy("firebase", "firebase");
  server.auth.default("firebase");

  // register all need plugins
  await server.register([home, auth, user, plant, collection, history]);
  await server.initialize();

  return server;
}

async function startServer(server) {
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  return server;
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

module.exports = {
  createServer,
  startServer,
};

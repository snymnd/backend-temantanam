const welcomeHandler = require("./handlers/mainHandlers");

const routes = [
  {
    method: "*",
    path: "/",
    handler: welcomeHandler,
  },
];

module.exports = routes;

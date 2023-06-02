const homeHandler = require("../handlers/homeHandlers");

module.exports = homePlugin = {
  name: "app/home",
  register: async function (server) {
    server.route([
      {
        method: "GET",
        path: "/",
        config: {
          auth: false,
        },
        handler: homeHandler,
      },
    ]);
  },
};

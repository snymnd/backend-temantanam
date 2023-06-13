const {
    getPlantHandler,
  } = require("../handlers/plantHandlers");

module.exports = plantPlugin = {
    name: "app/plant",
    register: async function (server) {
      server.route([
        {
          method: "GET",
          path: "/plant/{plantName}/{userId}",
          config: {
            // auth: false,
          },
          handler: getPlantHandler,
        },
      ]);
    },
  };
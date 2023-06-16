const {
    getPlantByClassificationHandler,
    getPlantByIdHandler,
  } = require("../handlers/plantHandlers");

module.exports = plantPlugin = {
    name: "app/plant",
    register: async function (server) {
      server.route([
        {
          method: "GET",
          path: "/plant/{classification}/{userId}",
          config: {
            // auth: false,
          },
          handler: getPlantByClassificationHandler,
        },
        {
          method: "GET",
          path: "/plant/{plantId}",
          config: {
            auth: false,
          },
          handler: getPlantByIdHandler,
        },
      ]);
    },
  };
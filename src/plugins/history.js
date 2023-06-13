const {
    getHistoryHandler,
  } = require("../handlers/historyHandlers");
  
  module.exports = historyPlugin = {
    name: "app/history",
    register: async function (server) {
      server.route([
        {
          method: "GET",
          path: "/history/{userId}",
          config: {
            // auth: false,
          },
          handler: getHistoryHandler,
        },
      ]);
    },
  };
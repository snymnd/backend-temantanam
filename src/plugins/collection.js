const {
    getCollectionHandler,
    addCollectionHandler,
    deleteCollectionHandler,
  } = require("../handlers/collectionHandlers");
  
  module.exports = collectionPlugin = {
    name: "app/collection",
    register: async function (server) {
      server.route([
        {
          method: "GET",
          path: "/collection/{userId}",
          config: {
            // auth: false,
          },
          handler: getCollectionHandler,
        },
        {
            method: "POST",
            path: "/collection/{userId}",
            config: {
            //   auth: false,
            },
            handler: addCollectionHandler,
        },
        {
            method: "DELETE",
            path: "/collection/delete/{collectionId}",
            config: {
            //   auth: false,
            },
            handler: deleteCollectionHandler,
        },
      ]);
    },
  };
const {
  getUserHandler,
  updateUserHandler,
} = require("../handlers/userHandlers");

module.exports = userPlugin = {
  name: "app/user",
  register: async function (server) {
    server.route([
      {
        method: "GET",
        path: "/user/{userId}",
        config: {
          auth: false,
        },
        handler: getUserHandler,
      },
      {
        method: "PUT",
        path: "/user/update/{userId}",
        config: {
          // auth: false,
        },
        handler: updateUserHandler,
      },
    ]);
  },
};

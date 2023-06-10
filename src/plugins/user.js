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
<<<<<<< HEAD
        path: "/user/{userId}",
        config: {
          // auth: false,
=======
        path: "/user/{userId?}",
        config: {
          auth: false,
>>>>>>> 9338d39 (implement create update users)
        },
        handler: getUserHandler,
      },
      {
        method: "PUT",
        path: "/user/update/{userId}",
        config: {
<<<<<<< HEAD
          // auth: false,
=======
          auth: false,
>>>>>>> 9338d39 (implement create update users)
        },
        handler: updateUserHandler,
      },
    ]);
  },
};

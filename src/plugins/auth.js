const {
  registerHandler,
  loginHandler,
  logoutHandler,
} = require("../handlers/authHandlers");

module.exports = authPlugin = {
  name: "app/auth",
  register: async function (server) {
    server.route([
      {
        method: "POST",
        path: "/auth/register",
        config: {
          auth: false,
        },
        handler: registerHandler,
      },
      {
        method: "POST",
        path: "/auth/login",
        config: {
          auth: false,
        },
        handler: loginHandler,
      },
      {
        method: "GET",
        path: "/auth/logout",
        config: {
          auth: false,
        },
        handler: logoutHandler,
      },
    ]);
  },
};

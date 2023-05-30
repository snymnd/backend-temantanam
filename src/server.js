const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  // eslint-disable-next-line no-console
  console.log("Server running on %s", server.info.uri);
  await server.start();
  
};

init();

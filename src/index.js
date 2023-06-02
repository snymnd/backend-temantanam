const { startServer, createServer } = require("./server")

createServer()
  .then(startServer)
  .catch(err => {
    console.log(err)
  })
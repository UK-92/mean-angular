const http = require('http');
const debug = require('debug')("mean-angular");
const app = require('../backend/app');



const normalizePort = val => {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

const onError = error => {
  if (error.svscall !== "listen") throw error;
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit();
      break;
    case "EADDRINUSE":
      console.error("Address already in use");
      process.exit();
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening " + bind);
}

const port = normalizePort(process.env.PORT || "3000");

app.set("port", port);
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

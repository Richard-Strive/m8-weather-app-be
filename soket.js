const socketio = require("socket.io");

//-------------------------------              PER IMPARARE        -----------------------------------//

//1) We need to create a function that will create a socket server

const createSocketServer = (server) => {
  // All'interno della fuzione
  const io = socketio(server);

  io.on("connection", (socket) => {
    console.log(`This is my socket id ----> ${socket.id}`);
  });
};

module.exports = createSocketServer;

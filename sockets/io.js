// sockets/io.js
// This module initializes Socket.IO and exposes helper accessors.
// The separation keeps socket server lifecycle isolated from HTTP routes/controllers.

const { Server } = require("socket.io");

let ioInstance = null;

// Initialize Socket.IO with an existing HTTP server
function initSocketIO(httpServer) {
  ioInstance = new Server(httpServer, {
    cors: { origin: "*" },
  });
  return ioInstance;
}

// Get the initialized io instance
function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized. Call initSocketIO(server) first.");
  }
  return ioInstance;
}

module.exports = {
  initSocketIO,
  getIO,
};



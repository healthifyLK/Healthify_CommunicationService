const express = require("express");
const http = require("http");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const sequelize = require("./config/sequelize");
const { initSocketIO } = require("./sockets/io");
const { registerChatHandlers } = require("./sockets/chat.handlers");
const Conversation = require("./models/conversation");
const Message = require("./models/message");
const FileAttachment = require("./models/fileAttachment");
const CallLog = require("./models/callLogs");
const UserPresence = require("./models/userPresence");
const conversationRoutes = require("./routes/conversation.routes");
const messageRoutes = require("./routes/message.routes");
const fileRoutes = require("./routes/file.routes");
const callRoutes = require("./routes/call.routes");

const PORT = process.env.PORT || 5004;

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan());

// Development auth middleware (DO NOT enable in production)
if (process.env.NODE_ENV === 'development') {
  const devAuth = require('./middlewares/devAuth');
  app.use(devAuth);
}

// Serve uploaded files statically for preview
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/calls", callRoutes);

// Start   the server only if the database connection is successful
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // sync the models with the database
    await sequelize.sync({ alter: true });
    console.log("Database models synced successfully");

    // Initialize Socket.IO and register handlers

    const io = initSocketIO(server);

    io.on("connection", (socket) => {
      registerChatHandlers(io, socket);
    });

    // Start the HTTP server (Socket.IO is bound to it)
    server.listen(PORT, () => {
      console.log(`Communication Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
})();

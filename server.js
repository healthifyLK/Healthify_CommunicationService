const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./config/sequelize");
const Conversation = require("./models/conversation");
const Message = require("./models/message");
const FileAttachment = require("./models/fileAttachment");
const CallLog = require("./models/callLogs");
const UserPresence = require("./models/userPresence");

const PORT = process.env.PORT || 5004;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan());

(
  // Start   the server only if the database connection is successful
  async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connected successfully");

      // sync the models with the database
      await sequelize.sync({ alter: true });
      console.log("Database models synced successfully");

      // Start the server
      app.listen(PORT, () => {
        console.log(`Communication Service is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Unable to connect to the database:", error.message);
      process.exit(1);
    }
  }
)();

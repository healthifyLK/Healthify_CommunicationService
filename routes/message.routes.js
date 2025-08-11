const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessage,
  updateMessageStatus,
  deleteMessage,
  searchMessages,
} = require("../controllers/message.controller");

// POST api/messages
// send a new Message
router.post("/", sendMessage);

// GET api/messages/:id
// Get a message
router.get("/:id", getMessage);

// PUT api/messages/:id/status
// Update message status
router.put("/:id/status", updateMessageStatus);

// DELETE api/messages/:id
// Delete a message
router.delete("/:id", deleteMessage);

// GET api/messages/search/:conversationId
// search messages
router.get("/search/:conversationId", searchMessages);

module.exports = router;
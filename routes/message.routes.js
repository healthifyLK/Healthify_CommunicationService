const express = require("express");
const router = express.Router();

// POST api/messages
// send a new Message
router.post("/");

// GET api/messages/:id
// Get a message
router.get("/:id");

// PUT api/messages/:id/status
// Update message status
router.put("/:id/status");

// DELETE api/messages/:id
// Delete a message
router.delete("/:id");

// GET api/messages/search/:conversationId
// search messages
router.get("/search/:conversationId");

const express = require("express");
const router = express.Router();

// GET api/conversations
// get all the conversations
router.get("/");

// POST api/conversations
// create a new conversation
router.post("/");

// GET api/conversations/:id
// get a conversation by ID
router.get("/:id");

// GET api/conversations/:id/messages
// get messsages related to conversation
router.get("/:id/messages");

// PUT api/conversations/:id/status
// Update Conversation Status
router.put("/:id/status");

// POST api/conversations/:id/mark-read
// Mark message in a conversation to read
router.post("/:id/mark-read");

// GET api/conversations/:id/unread
// Get unread messages of a conversation
router.get("/:id/unread");

module.exports = router

const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversations,
  getConversationById,
  getConversationMessages,
  updateConversationStatus,
  markMessagesAsRead,
  getUnreadMessages,
} = require("../controllers/conversation.controller");

// GET api/conversations
// get all the conversations
// router.get("/",getConversations);

// POST api/conversations
// create a new conversation
router.post("/",createConversation);

// GET api/conversations/:id
// get a conversation by ID
router.get("/:id",getConversationById);

// GET api/conversations/:id/messages
// get messsages related to conversation
router.get("/:id/messages",getConversationMessages);

// PUT api/conversations/:id/status
// Update Conversation Status
router.put("/:id/status",updateConversationStatus);

// POST api/conversations/:id/mark-read
// Mark message in a conversation to read
router.post("/:id/mark-read",markMessagesAsRead);

// GET api/conversations/:id/unread
// Get unread messages of a conversation
router.get("/:id/unread",getUnreadMessages);

module.exports = router;

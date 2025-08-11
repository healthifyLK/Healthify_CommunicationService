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
// Get all the conversations (disabled; enable when needed)
// router.get("/",getConversations);

// POST api/conversations
// Create a new conversation
// Tested and working
router.post("/",createConversation);

// GET api/conversations/:id
// Get a conversation by ID
router.get("/:id",getConversationById);

// GET api/conversations/:id/messages
// Get messages related to conversation
router.get("/:id/messages",getConversationMessages);

// PUT api/conversations/:id/status
// Update conversation status
router.put("/:id/status",updateConversationStatus);

// POST api/conversations/:id/mark-read
// Mark messages in a conversation as read by current user
router.post("/:id/mark-read",markMessagesAsRead);

// GET api/conversations/:id/unread
// Get unread messages of a conversation for current user
router.get("/:id/unread",getUnreadMessages);

module.exports = router;

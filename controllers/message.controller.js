const conversationService = require("../services/conversation.service");
const messageService = require("../services/message.service");

// POST api/messages
// send a new Message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const userId = req.user.id;
    const userType = req.user.userType;

    if (!conversationId || !content) {
      return res.status(400).json({
        message: "ConversationId and content cannot be empty",
      });
    }
    // Verify user has access to this conversation
    const conversation = await conversationService.getConversationById(
      conversationId
    );
    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    if (
      conversation.patient_id !== userId &&
      conversation.provider_id !== userId
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    const message = await messageService.sendMessage({
      conversation_id: conversationId,
      sender_id: userId,
      sender_type: userType,
      content,
      status: "sent",
    });
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET api/messages/:id
// Get a message

const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await messageService.getMessageById(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    // Verify user has access to this message's conversation
    if (
      message.conversation.patient_id !== userId &&
      message.conversation.provider_id !== userId
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// PUT api/messages/:id/status
// Update message status

const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }
    const message = await messageService.getMessageById(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }
    // Verify user has access to this message's conversation
    if (
      message.conversation.patient_id !== userId &&
      message.conversation.provider_id !== userId
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const updatedMessage = await messageService.updateMessageStatus(id, status);

    if (!updatedMessage) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json(updatedMessage);
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
// DELETE api/messages/:id
// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await messageService.getMessageById(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not foumd",
      });
    }
    // Only allow deletion bythe sender
    if (message.sender_id !== userId) {
      return res.status(403).json({
        message: "Only the sender can delete this message",
      });
    }

    const deleted = await messageService.deleteMessage(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Message not found",
      });
    }
    res.json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET api/messages/search/:conversationId
// search messages
const searchMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { q: searchTerm } = req.query;
    const userId = req.user.id;

    if (!searchTerm) {
      return res.status(400).json({
        message: "Search Term is required",
      });
    }
    // Verify user has access to this conversation
    const conversation = await conversationService.getConversationById(
      conversationId
    );
    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    if (
      conversation.patient_id !== userId &&
      conversation.provider_id !== userId
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const messages = await messageService.searchMessages(
      conversationId,
      searchTerm
    );

    res.json(messages);
  } catch (error) {
    console.error("Error searching messages:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  sendMessage,
  getMessage,
  updateMessageStatus,
  deleteMessage,
  searchMessages,
};


const conversationService = require("../services/conversation.service");
const messageService = require("../services/message.service");

// POST api/conversations/
// Create a new conversation for a given appointment and participants
const createConversation = async (req, res) => {
  try {
    const { appointment_id, patient_id, provider_id, conversationType } =
      req.body;
    if (!appointment_id || !patient_id || !provider_id || !conversationType) {
      return res.status(400).json({
        message: "appointment_id, patient_id,provider_id and type are required",
      });
    }

    // Check if conversation already exists for the appointment
    const existingConversation =
      await conversationService.getConversationByAppointmentId(appointment_id);
    if (existingConversation) {
      return res.status(409).json({
        message: "Conversation already exists for the appointment",
      });
    }

    const conversation = await conversationService.createConversation({
      appointment_id,
      patient_id,
      provider_id,
      conversationType,
      status: "active",
      startedAt: new Date(),
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};

// GET api/conversations
// Get all conversations
const getConversations = async (req, res) => {};

// GET api/conversations/:id
// Get a conversation by Id; caller must be a participant
// Need fix
const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await conversationService.getConversationById(id);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }
    // Check user has access to the conversation
    if (
      conversation.patient_id !== userId &&
      conversation.provider_id !== userId
    ) {
      return res.status(403).json({ message: "Access Denied" });
    }
    res.json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};

// GET api/conversations/:id/messages
// Get messages related to a conversation; guards access by participant check

const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get the conversation
    const conversation = await conversationService.getConversationById(id);
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
        message: "Access Denied",
      });
    }
    // call the message service here
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// PUT api/conversations/:id/status
// Update conversation status; only participants allowed
const updateConversationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }
    // Get the conversation and verify user has access to it
    const conversation = await conversationService.getConversationById(id);
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

    const updatedConversation =
      await conversationService.updateConversationStatus(id, status);
    if (!updatedConversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }
    res.json(updatedConversation);
  } catch (error) {
    console.error("Error updating conversation status:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// POST api/conversations/:id/mark-read
// Mark messages as read for the authorized user in the conversation
const markMessagesAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await conversationService.getConversationById(id);
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
    // Update unread messages as read and broadcast receipts

    const result = await messageService.marksMessagesAsRead(id, userId);

    // Emit read receipts to the room for other participants
    try {
      const { getIO } = require("../sockets/io");
      const io = getIO();
      io.to(`conversation:${id}`).emit("message:read", {
        conversationId: id,
        readerId: userId,
        messageIds: result.messageIds,
        updatedCount: result.updatedCount,
      });
    } catch (e) {
      // Socket not initialized, ignore
    }

    return res.json({
      message: "Messages marked as read",
      ...result,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET api/conversations/:id/unread
// Get unread messages of a conversation for the authorized user

const getUnreadMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await conversationService.getConversationById(id);
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
    //call the message service
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  getConversationMessages,
  updateConversationStatus,
  markMessagesAsRead,
  getUnreadMessages,
};

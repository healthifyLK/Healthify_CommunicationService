const { Op } = require("sequelize");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const CallLog = require("../models/callLogs");
const e = require("cors");

// Create a new Conversation
const createConversation = async (conversationData) => {
  try {
    return await Conversation.create(conversationData);
  } catch (error) {
    console.error("Error creating Conversation", error);
    throw error;
  }
};

// Get conversation by ID
const getConversationById = async (conversationId) => {
  try {
    return await Conversation.findByPk(
       conversationId ,
      {
        include: [
          {
            model: Message,
            as: "messages",
            limit: 50,
            order: [["createdAt", "DESC"]],
          },
        ],
      }
    );
  } catch (error) {
    console.error("Error fetching conversation By Id", error);
    throw error;
  }
};

// Get conversation by appointment Id
const getConversationByAppointmentId = async (appointmentId) => {
  try {
    return await Conversation.findOne({
      where: { appointment_id: appointmentId },
    });
  } catch (error) {
    console.error("Error fetching conversation by appointment ID:", error);
    throw error;
  }
};

// Update Conversation Status
const updateConversationStatus = async (conversationId, status) => {
  try {
    const [updatedRowsCount] = await Conversation.update(
      { status },
      { where: { id: conversationId }, returning: true }
    );

    if (updatedRowsCount === 0) {
      return null;
    }
    return await getConversationById(conversationId);
  } catch (error) {
    console.error("Error updating conversation status:", error);
    throw error;
  }
};

// Delete conversation
const deleteConversation = async (id) => {
  try {
    const deletedRowsCount = await Conversation.destroy({
      where: { id },
    });
    return deletedRowsCount > 0;
  } catch (error) {
    console.error("Error deleting conversation", error);
    throw error;
  }
};

// Get the call logs related to conversation
const getConversationCallLogs = async (conversationId) => {
  try {
    return await CallLog.findAll({
      where: { conversation_id: conversationId },
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.error("Error fetching conversation call logs:", error);
    throw error;
  }
};

module.exports = {
  createConversation,
  getConversationById,
  getConversationByAppointmentId,
  updateConversationStatus,
  deleteConversation,
  getConversationCallLogs,
};

const Conversation = require("../models/conversation");
const Message = require("../models/message");
const FileAttachment = require("../models/fileAttachment");
const { Op } = require("sequelize");

// Persist a new message; computes word_count if content provided
const sendMessage = async (messageData) => {
  try {
    // Calculate word count if content is provided
    if (messageData.content) {
      messageData.word_count = messageData.content.trim().split(/\s+/).length;
    }

    const message = await Message.create(messageData);
    return getMessageById(message.id);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Fetch a message including its attachments and conversation metadata
const getMessageById = async (id) => {
  try {
    return await Message.findByPk(id, {
      include: [
        { model: FileAttachment, as: "attachments" },
        {
          model: Conversation,
          as: "conversation",
          attributes: ["id", "appointment_id"],
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching message by ID:", error);
    throw error;
  }
};

// Get conversation messages
// Returns ordered messages with attachments for pagination-friendly consumption
const getConversationMessages = async (
  conversationId,
  limit = 50,
  offset = 0
) => {
  try {
    return await Message.findAll({
      where: { conversation_id: conversationId },
      include: [{ model: FileAttachment, as: "attachments" }],
      order: [["createdAt", "ASC"]],
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    throw error;
  }
};

const updateMessageStatus = async (messageId, status) => {
  try {
    const [updatedRowsCount] = await Message.update(
      { status },
      { where: { id: messageId }, returning: true }
    );

    if (updatedRowsCount === 0) {
      return null;
    }
    return await getMessageById(messageId);
  } catch (error) {
    console.error("Error updating message status:", error);
    throw error;
  }
};

const marksMessagesAsRead = async (conversationId, userId) => {
  try {
    const [updatedRowsCount] = await Message.update(
      { status: "read" },
      {
        where: {
          conversation_id: conversationId,
          sender_id: { [Op.ne]: userId },
          status: { [Op.ne]: "read" },
        },
      }
    );
    return updatedRowsCount;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

const getUnreadMessages = async (conversationId, userId) => {
  try {
    return await Message.findAll({
      where: {
        conversation_id: conversationId,
        sender_id: { [Op.ne]: userId },
        status: { [Op.ne]: "read" },
      },
      order: [["createdAt", "ASC"]],
    });
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    throw error;
  }
};

const deleteMessage = async (id) => {
  try {
    const deletedRowsCount = await Message.destroy({
      where: { id },
    });
    return deletedRowsCount > 0;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

const searchMessages = async (conversationId, searchTerm) => {
  try {
    return await Message.findAll({
      where: {
        conversation_id: conversationId,
        content: {
          [Op.iLike]: `%${searchTerm}`,
        },
      },
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.error("Error searching messages:", error);
    throw error;
  }
};
module.exports = {
  sendMessage,
  getMessageById,
  getConversationMessages,
  updateMessageStatus,
  marksMessagesAsRead,
  getUnreadMessages,
  deleteMessage,
  searchMessages,
};

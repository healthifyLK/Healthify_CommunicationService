const CallLog = require("../models/callLogs");
const Conversation = require("../models/conversation");
// Create a callLog
const createCallLog = async (callData) => {
  try {
    return await CallLog.create(callData);
  } catch (error) {
    console.error("Error creating call log", error);
    throw error;
  }
};

// Get call log by Id
const getCallLogById = async (logId) => {
  try {
    return await CallLog.findByPk(
      { log_id: logId },
      {
        include: [
          {
            model: Conversation,
            as: "conversation",
            attributes: ["id", "appointment_id", "patient_id", "provider_id"],
          },
        ],
      }
    );
  } catch (error) {
    console.error("Error fetching call log by ID", error);
    throw error;
  }
};

// Update call log
const updateCallLog = async (logId, updateData) => {
  try {
    const [updatedRowsCount] = await CallLog.update(updateData, {
      where: { log_id: logId },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return null;
    }
    return await getCallLogById(logId);
  } catch (error) {
    console.error("Error updating call log:", error);
    throw error;
  }
};

// Get conversation call logs
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

// End call
const endCall = async (logId) => {
  try {
    const callLog = await getCallLogById({ log_id: logId });

    if (!callLog) {
      return null;
    }

    const endedAt = new Date();
    const duration = callLog.startedAt
      ? Math.floor((endedAt - callLog.startedAt) / 1000)
      : 0;

    return await updateCallLog(
      { log_id: logId },
      {
        endedAt,
        duration,
      }
    );
  } catch (error) {
    console.error("Error ending call:", error);
    throw error;
  }
};

module.exports = {
  createCallLog,
  getCallLogById,
  updateCallLog,
  getConversationCallLogs,
  endCall,
};

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

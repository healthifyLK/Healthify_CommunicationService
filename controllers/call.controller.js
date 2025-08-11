// controllers/call.controller.js
// REST endpoints to manage video calls using LiveKit tokens and call logs.
// Flow: initiate -> join -> end -> history

const conversationService = require("../services/conversation.service");
const callService = require("../services/call.service");
const {
  generateLivekitToken,
  generateRoomName,
} = require("../config/livekitConfig");


// POST api/calls
// Initiate a call: verifies access, creates a room name, issues a LiveKit token, creates a call log
const initiateCall = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user.id;

    if (!conversationId) {
      return res.status(400).json({
        message: "Conversation Id is rwquired",
      });
    }

    // Verify user hass access to the conversation
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
    // Generate room name and LiveKit token
    const roomName = generateRoomName(conversationId);
    try {
      const token = await generateLivekitToken(roomName, userId);

      // Create call log
      const callLog = await callService.createCallLog({
        conversation_id: conversationId,
        roomName,
        startedAt: new Date(),
        participants: [userId],
        initiatedBy: userId,
      });
      res.status(201).json({
        callId: callLog.log_id,
        roomName,
        token,
      });
    } catch (tokenError) {
      console.error("Error generating LiveKit token:", tokenError);
      res.status(500).json({
        message:
          "Unable to generate call token. Video calling may not be configured.",
      });
    }
  } catch (error) {
    console.error("Error initiating call:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET api/calls/:id/join
// Join the call: verifies participant access, issues a LiveKit token for the joiner, updates call log participants

const joinCall = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const callLog = await callService.getCallLogById(id);
    if (!callLog) {
      return res.status(404).json({
        message: "Call not found",
      });
    }

    // Verify user has access to this call conversation
    const conversation_id = callLog.conversation_id;
    const conversation = await conversationService.getConversationById(
      conversation_id
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
        message: "Access Denied",
      });
    }
    try {
      // Generate LiveKit token for this user
      const token = await generateLivekitToken(callLog.roomName, userId);
      //update call log with participants
      const updatedParticipants = [...callLog.participants];
      if (!updatedParticipants.includes(userId)) {
        updatedParticipants.push(userId);
      }
      await callService.updateCallLog(id, {
        participants: updatedParticipants,
      });
      res.json({
        callId: callLog.log_id,
        roomName: callLog.roomName,
        token,
      });
    } catch (tokenError) {
      console.error("Error generating LiveKit token:", tokenError);
      res.status(500).json({
        message:
          "Unable to generate call token. Video calling may not be configured.",
      });
    }
  } catch (error) {
    console.error("Error joining call:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// POST api/calls/:id/end
// End the call: verifies access, closes call log by setting endedAt and duration
const endCall = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const callLog = await callService.getCallLogById(id);

    if (!callLog) {
      return res.status(404).json({
        message: "Call not found",
      });
    }

    // Verify user has access to this call conversation
    const conversation_id = callLog.conversation_id;
    const conversation = await conversationService.getConversationById(
      conversation_id
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
        message: "Access Denied",
      });
    }

    const updatedCallLog = await callService.endCall(id);

    if (!updatedCallLog) {
      return res.status(404).json({
        message: "Call not found",
      });
    }
    res.json({
      message: "Call ended succesfully",
      call: {
        id: updatedCallLog.log_id,
        duration: updatedCallLog.duration,
        endTime: updatedCallLog.endedAt,
      },
    });
  } catch (error) {
    console.error("Error ending call:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET api/calls/history/:conversationId
// Get the call history related to a specific conversation
const getCallHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
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
        message: "Access Denied",
      });
    }

    const callLogs = await callService.getConversationCallLogs(conversationId);
    res.json(callLogs);
  } catch (error) {
    console.error("Error fetching call history:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  initiateCall,
  joinCall,
  endCall,
  getCallHistory,
};

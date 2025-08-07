const conversationService = require("../services/conversation.service");

// POST api/calls
// Initialte a call
const initiateCall = async (req, res) => {};

// GET api/calls/:id/join
// Join the calls

const joinCall = async (req, res) => {};

// POST api/calls/:id/end
// End the call
const endCall = async (req, res) => {};

// GET api/calls/history/:conversationId
// Get the call history related to specific conversation
const getCallHistory = async (req, res) => {};

module.exports = {
  initiateCall,
  joinCall,
  endCall,
  getCallHistory,
};

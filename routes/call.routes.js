const express = require("express");
const router = express.Router();
const {
  initiateCall,
  joinCall,
  endCall,
  getCallHistory,
} = require("../controllers/call.controller");

// POST api/calls
// Initiate a call
router.post("/", initiateCall);

// GET api/calls/:id/join
// Join the calls
router.get("/:id/join", joinCall);

// POST api/calls/:id/end
// End the call
router.post("/:id/end", endCall);

// GET api/calls/history/:conversationId
// Get the call history related to specific conversation
router.get("/history/:conversationId", getCallHistory);

module.exports = router;

// routes/call.routes.js
// Defines REST routes for starting, joining, ending calls and fetching call history
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
// Join an existing call session
router.get("/:id/join", joinCall);

// POST api/calls/:id/end
// End the call session
router.post("/:id/end", endCall);

// GET api/calls/history/:conversationId
// Get call history for a conversation
router.get("/history/:conversationId", getCallHistory);

module.exports = router;

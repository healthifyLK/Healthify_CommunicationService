const express = require("express");
const router = express.Router();

// POST api/calls
// Initiate a call
router.post("/");

// GET api/calls/:id/join
// Join the calls
router.get("/:id/join");

// POST api/calls/:id/end
// End the call
router.post("/:id/end");

// GET api/calls/history/:conversationId
// Get the call history related to specific conversation
router.get("/history/:conversationId");

module.exports = router

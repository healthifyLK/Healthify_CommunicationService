const express = require("express");
const router = express.Router();

// POST api/files/upload
// Upload a file
router.post("/upload");

// GET api/files/:id/download
// Download a file
router.get("/:id/download");

// DELETE api/files/:id
// Delete a file
router.delete("/:id");

module.exports = router

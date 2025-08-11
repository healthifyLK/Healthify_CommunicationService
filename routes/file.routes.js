const express = require("express");
const router = express.Router();
const upload = require("../config/configMulter");
const {
  uploadFile,
  downloadFile,
  deleteFile,
} = require("../controllers/file.controller");

// POST api/files/upload
// Upload a file
router.post("/upload", upload.single("file"), uploadFile);

// GET api/files/:id/download
// Download a file
router.get("/:id/download", downloadFile);

// DELETE api/files/:id
// Delete a file
router.delete("/:id", deleteFile);

module.exports = router;

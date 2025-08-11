const path = require("path");
const fs = require("fs");
const fileService = require("../services/file.service");
const Message = require("../models/message");

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  await fs.promises.mkdir(uploadsDir, { recursive: true });
  return uploadsDir;
};

// POST api/files/upload
// Upload a file and create FileAttachment record
const uploadFile = async (req, res) => {
  try {
    const { messageId, fileCategory } = req.body;
    const userId = req.user?.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!messageId || !fileCategory) {
      return res
        .status(400)
        .json({ message: "messageId and fileCategory are required" });
    }

    // Validate message exists
    const message = await Message.findByPk({ id: messageId });
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const uploadsDir = await ensureUploadsDir();

    // Persist file to disk
    const timestamp = Date.now();
    const safeOriginalName = path.basename(req.file.originalname);
    const storedFileName = `${timestamp}-${safeOriginalName}`;
    const storedFilePath = path.join(uploadsDir, storedFileName);

    await fs.promises.writeFile(storedFilePath, req.file.buffer);

    // Save metadata
    const attachment = await fileService.createAttachment({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileCategory,
      filePath: storedFileName, // store relative name; served via /uploads
      uploadedBy: userId,
      uploadedDate: new Date(),
      message_id: messageId,
    });

    return res.status(201).json(attachment);
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET api/files/:id/download
// Download a file by attachment id
const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const attachment = await fileService.getAttachmentById(id);
    if (!attachment) {
      return res.status(404).json({ message: "File not found" });
    }
    const uploadsDir = path.join(__dirname, "..", "uploads");
    const absolutePath = path.join(uploadsDir, attachment.filePath);
    return res.download(absolutePath, attachment.fileName);
  } catch (error) {
    console.error("Error downloading file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE api/files/:id
// Delete a file and its record
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const attachment = await fileService.getAttachmentById(id);
    if (!attachment) {
      return res.status(404).json({ message: "File not found" });
    }
    const uploadsDir = path.join(__dirname, "..", "uploads");
    const absolutePath = path.join(uploadsDir, attachment.filePath);

    // Remove DB record first to avoid dangling reference if fs fails
    await fileService.deleteAttachmentById(id);

    // Best-effort file deletion
    try {
      await fs.promises.unlink(absolutePath);
    } catch (e) {
      // Ignore if already deleted
      if (e.code !== "ENOENT") throw e;
    }

    return res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
};

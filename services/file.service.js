const FileAttachment = require("../models/fileAttachment");

// Create a new file attachment record
const createAttachment = async (attachmentData) => {
  try {
    const attachment = await FileAttachment.create(attachmentData);
    return attachment;
  } catch (error) {
    console.error("Error creating file attachment:", error);
    throw error;
  }
};

// Get an attachment by primary key
const getAttachmentById = async (id) => {
  try {
    return await FileAttachment.findByPk(id);
  } catch (error) {
    console.error("Error fetching file attachment by ID:", error);
    throw error;
  }
};

// Delete an attachment by primary key (returns true if deleted)
const deleteAttachmentById = async (id) => {
  try {
    const deletedCount = await FileAttachment.destroy({ where: { id } });
    return deletedCount > 0;
  } catch (error) {
    console.error("Error deleting file attachment:", error);
    throw error;
  }
};

module.exports = {
  createAttachment,
  getAttachmentById,
  deleteAttachmentById,
};


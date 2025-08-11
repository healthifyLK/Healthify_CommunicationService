const { DataTypes, UUID, UUIDV4 } = require("sequelize");
const sequelize = require("../config/sequelize");
const Message = require("./message");

// Define File Attachment model
const FileAttachment = sequelize.define(
  "FileAttachment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileCategory: {
      type: DataTypes.ENUM(
        "SymptomImg",
        "LabReports",
        "Prescription",
        "MedicalCertificate"
      ),
      allowNull: false,
    },
    filePath: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    uploadedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "fileattachments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
FileAttachment.belongsTo(Message, {
  foreignKey: "message_id",
  as: "message",
});
Message.hasMany(FileAttachment, {
  foreignKey: "message_id",
  as: "attachments",
});

module.exports = FileAttachment;

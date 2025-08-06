const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");



// Define the conversation model
const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    appointment_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    provider_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    mode: {
      type: DataTypes.ENUM("chat", "video"),
      allowNull: false,
    },
    conversationType: {
      type: DataTypes.ENUM("consultation", "follow-up", "ever-care"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Completed", "active"),
      allowNull: false,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "conversations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);




module.exports = Conversation;

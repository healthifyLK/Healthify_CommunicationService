const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/sequelize");
const Conversation = require("./conversation");

// Define message model
const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sender_type: {
      type: DataTypes.ENUM("Provider", "Patient"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    word_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("read", "sent"),
      allowNull: false,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
Conversation.hasMany(Message, {
  foreignKey: "conversation_id",
  as: "messages",
});
Message.belongsTo(Conversation, {
  foreignKey: "conversation_id",
});

module.exports = Message;

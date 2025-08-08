const { DataTypes, UUID, UUIDV4 } = require("sequelize");
const sequelize = require("../config/sequelize");
const Conversation = require("./conversation");

// Define Call Log model
const CallLog = sequelize.define(
  "CallLog",
  {
    log_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    initiatedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    roomName:{
      type:DataTypes.STRING,
      allowNull:false
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    participants:{
      type:DataTypes.ARRAY(DataTypes.UUID),
      allowNull:false
    }
  },
  {
    tableName: "call_logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Asscoiations
CallLog.belongsTo(Conversation, {
  foreignKey: "conversation_id",
});

module.exports = CallLog;

const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/sequelize");
const Conversation = require('./conversation')

// Define user presence model
const UserPresence = sequelize.define(
  "UserPresence",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Online", "Offline"),
      allowNull: false,
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "user_presence",
    timestamps: true,
    updatedAt: "updated_at",
  }
);

// Associations
UserPresence.belongsTo(Conversation,{
    foreignKey:"conversation_id"
})
module.exports = UserPresence;

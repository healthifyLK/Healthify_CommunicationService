const { AccessToken } = require("livekit-server-sdk");
require("dotenv").config();

const generateLivekitToken = async (roomName, userId, expireTime = 7200) => {
  try {
    // Validate environment variables
    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      throw new Error("Livekit credentials not configured");
    }

    // Create a new Access Token Instance
    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: userId.toString(),
      }
    );

    // Set permsissions
    const permsissions = {
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    };
    // Add Permissions to the token
    token.addGrant(permsissions);
    const currentTime = Math.floor(Date.now() / 1000);
    token.expiresAt = currentTime + expireTime;

    // Generate JWT
    return token.toJwt();
  } catch (error) {
    console.error("Error generating Livekit Token", error);
    throw error;
  }
};

// Generate room name
const generateRoomName = (conversationId) => {
  return `call_${conversationId}_${Date.now()}`;
};

module.exports = {
  generateLivekitToken,
  generateRoomName,
};

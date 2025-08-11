// config/livekitConfig.js
// Provides helpers to generate LiveKit access tokens and room names.
// These tokens are used by clients (patient/provider) to join a LiveKit room via the client SDK.

const { AccessToken } = require("livekit-server-sdk");
require("dotenv").config();

// Generate a LiveKit JWT token that grants access to a specific room.
// - roomName: The LiveKit room to join
// - userId: Unique identifier of the user (string/UUID)
// - expireTime: Token TTL in seconds (default: 2 hours)
const generateLivekitToken = async (roomName, userId, expireTime = 7200) => {
  try {
    // Validate environment variables
    const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      throw new Error("LiveKit credentials not configured");
    }

    // Create a new Access Token Instance with identity and TTL
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: String(userId),
      ttl: expireTime,
    });

    // Define fine-grained permissions for the room
    const permissions = {
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    };

    // Add permissions to the token
    token.addGrant(permissions);

    // Generate and return JWT
    return token.toJwt();
  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    throw error;
  }
};

// Generate a unique room name per conversation session
const generateRoomName = (conversationId) => {
  return `call_${conversationId}_${Date.now()}`;
};

module.exports = {
  generateLivekitToken,
  generateRoomName,
};

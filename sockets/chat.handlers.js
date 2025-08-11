// sockets/chat.handlers.js
// Encapsulates all chat-related socket event handlers.
// Rooms: we use `conversation:<conversationId>` as a room name so only participants receive events.

const registerChatHandlers = (io, socket) => {
  // Client requests to join a conversation room for real-time updates
  socket.on("conversation:join", ({ conversationId }) => {
    if (!conversationId) return;
    socket.join(`conversation:${conversationId}`);
  });

  // Client can leave a room
  socket.on("conversation:leave", ({ conversationId }) => {
    if (!conversationId) return;
    socket.leave(`conversation:${conversationId}`);
  });

  // Typing indicators
  socket.on("message:typing", ({ conversationId, userId, isTyping }) => {
    if (!conversationId || !userId) return;
    socket.to(`conversation:${conversationId}`).emit("message:typing", {
      conversationId,
      userId,
      isTyping: Boolean(isTyping),
    });
  });
};

module.exports = { registerChatHandlers };



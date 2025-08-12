// middlewares/devAuth.js
// Development-only middleware to mock user authentication
// DO NOT enable in production - this is only for local testing without API gateway

module.exports = function devAuth(req, res, next) {
  // If already set by real gateway, keep it
  if (req.user) return next();

  // Only run in development environment
  if (process.env.NODE_ENV !== 'development') return next();

  const userId = req.header('x-user-id');
  const userType = req.header('x-user-type'); // "Provider" | "Patient"

  if (!userId || !userType) {
    // Allow passing via query for convenience in dev (optional)
    const qUserId = req.query.dev_user_id;
    const qUserType = req.query.dev_user_type;
    if (qUserId && qUserType) {
      req.user = { id: qUserId, userType: qUserType };
      return next();
    }
    
    // If you prefer to enforce presence, uncomment below
    // return res.status(400).json({ message: 'Missing x-user-id/x-user-type headers in dev' });
  } else {
    req.user = { id: userId, userType };
  }

  next();
};
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function allowRoles(...roles) {
  return function roleMiddleware(req, res, next) {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission for this action.' });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  allowRoles
};

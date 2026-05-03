// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken')
const User = require('../model/user.model.js')
const ApiError = require('../utils/ApiError.js')
const asyncHandler = require('../utils/asyncHandler.js')
const logger = require('../utils/logger.js')

exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    logger.warn('Authorization attempt without token');
    throw new ApiError(401, 'Not authorized — no token')
  }

  // Verify token — handle expired or tampered tokens
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
    logger.debug('Token verified successfully', { userId: decoded.id });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Authorization attempt with expired token');
      throw new ApiError(401, 'Token has expired, please login again')
    } else if (error.name === 'JsonWebTokenError') {
      logger.warn('Authorization attempt with invalid token');
      throw new ApiError(401, 'Invalid token')
    } else {
      logger.warn('Token verification failed', { error: error.message });
      throw new ApiError(401, 'Token verification failed')
    }
  }

  // Find the user this token belongs to — attach FULL user object
  const user = await User.findById(decoded.id)

  if (!user) {
    // Token was valid but user was deleted
    logger.warn('Token valid but user not found', { userId: decoded.id });
    throw new ApiError(401, 'User no longer exists')
  }

  // Check if account is active
  if (user.isActive === false) {
    logger.warn('Authorization attempt with deactivated account', { userId: decoded.id });
    throw new ApiError(403, 'Account is deactivated')
  }

  // Attach user to request — available in all subsequent middleware
  req.user = user
  next()
})
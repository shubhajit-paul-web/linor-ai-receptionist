# Appointment Service Logger

## Overview
The appointment service uses **Winston** logger for professional, structured logging following industry standards.

## Features
- ✅ **Multiple log levels**: `error`, `warn`, `info`, `debug`
- ✅ **Dual output**: Console + file logging (error.log, combined.log)
- ✅ **Structured metadata**: Context-rich logs with timestamps and service name
- ✅ **Stack traces**: Full error stacks for debugging
- ✅ **Configurable**: Via `LOG_LEVEL` environment variable

## Usage

### Basic Logging
```javascript
const logger = require("../utils/logger");

// Info level (default for normal operations)
logger.info("Appointment created successfully", { appointmentId: id });

// Error level (with stack trace)
logger.error("Database connection failed", { message: err.message, stack: err.stack });

// Warning level
logger.warn("API key invalid", { path: req.path });

// Debug level (useful during development)
logger.debug("Token verified", { userId: req.user.id });
```

### With Metadata
All logs support metadata objects for context:
```javascript
logger.error("Failed to update appointment", {
  appointmentId: "123",
  status: "invalid",
  error: err.message
});
```

## Environment Variables

Add to your `.env`:
```
LOG_LEVEL=info          # Options: error, warn, info, debug (default: info)
MONGODB_URI=...         # Your MongoDB connection string
JWT_SECRET=...          # JWT secret for authentication
```

## Log Output Locations

- **Console**: Colorized, human-readable format (development-friendly)
- **logs/error.log**: Error level logs only (structured JSON)
- **logs/combined.log**: All logs (structured JSON)

## Log Levels Guide

| Level | Use Case | Example |
|-------|----------|---------|
| **error** | Critical failures | DB connection failed, service unavailable |
| **warn** | Issues that need attention | Invalid API key, token expired |
| **info** | Important operational events | Server started, appointment created |
| **debug** | Detailed debugging info | Token verified, API key checked |

## Integration Points

Logging is already integrated in:
- ✅ `server.js` - Server startup
- ✅ `src/app.js` - Error handler
- ✅ `src/db/db.js` - Database connection
- ✅ `src/middleware/auth.middleware.js` - JWT authentication
- ✅ `src/middleware/apiKeyAuth.js` - API key verification

## Best Practices

1. **Use appropriate levels**: Don't log everything at `info` level
2. **Include context**: Always pass relevant metadata for debugging
3. **No sensitive data**: Don't log passwords, tokens, or PII
4. **Keep it concise**: Use short, meaningful messages
5. **Structured logs**: Use metadata objects, not string concatenation

## Example: Adding Logging to New Code

```javascript
// ❌ Avoid
console.log("User logged in: " + userId);

// ✅ Better
logger.info("User login successful", { userId });

// ❌ Avoid
console.error(err);

// ✅ Better
logger.error("Appointment update failed", { appointmentId, error: err.message, stack: err.stack });
```

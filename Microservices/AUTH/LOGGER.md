# Logger Implementation

## Overview
A simple, production-ready logger for the AUTH microservice that replaces `console.log()` with structured logging at four levels: `debug`, `info`, `warn`, and `error`.

## Features
- ✅ **Log Levels**: debug, info, warn, error
- ✅ **Colored Output**: Terminal colors for easy readability
- ✅ **Timestamps**: ISO format with milliseconds
- ✅ **Structured Data**: Pass contextual data as second parameter
- ✅ **Environment Control**: Set `LOG_LEVEL` env var to control verbosity
- ✅ **No Dependencies**: Uses only Node.js built-ins

## Usage

### Basic Usage
```javascript
const logger = require('./src/utils/logger.js');

logger.info('User login successful');
logger.warn('Failed login attempt');
logger.error('Database connection failed');
logger.debug('Processing request', { requestId: '123' });
```

### With Structured Data
```javascript
logger.info('User registered', { email: 'user@example.com', userId: '456' });
logger.error('Auth failed', { message: error.message, code: 401 });
```

## Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| **debug** | Development & detailed tracing | `logger.debug('Processing...', { step: 1 })` |
| **info** | Important business events | `logger.info('User logged in', { userId: '123' })` |
| **warn** | Potential issues, but recoverable | `logger.warn('Failed login', { email: 'user@example.com' })` |
| **error** | Critical failures | `logger.error('DB connection failed', { host: 'mongodb...' })` |

## Configuration

### Environment Variable: LOG_LEVEL
Control what gets logged by setting `LOG_LEVEL` in your `.env`:

```bash
# Production (only warnings and errors)
LOG_LEVEL=warn

# Staging (all logs including debug)
LOG_LEVEL=debug

# Default (info, warn, error)
LOG_LEVEL=info
```

### Output Format
```
[HH:mm:ss.SSS] LEVEL message contextData
```

**Example:**
```
[14:32:05.342] INFO  User registered {"email":"doctor@hospital.com","userId":"507f1f77bcf86cd799439011"}
[14:32:15.421] WARN  Failed login {"email":"user@example.com","reason":"wrong_password"}
[14:32:20.105] ERROR Database connection failed {"message":"connection refused","host":"mongodb://localhost"}
```

## Where Logger is Used

### Core Files
- **server.js**: Server startup & unhandled rejections
- **src/db/db.js**: Database connection events
- **src/config/env.js**: Environment variable validation

### Auth Flow
- **src/Controllers/auth.controller.js**: Signup, login, logout events
- **src/Middlewares/auth.middleware.js**: Token verification attempts
- **src/Middlewares/error.middleware.js**: Error handling & details

## Best Practices

✅ **Do:**
- Use appropriate log levels (info for business events, warn for recoverable issues, error for failures)
- Include context data to aid debugging
- Log security-sensitive operations (login, auth failures)
- Log external service interactions (DB, APIs)

❌ **Don't:**
- Log passwords or sensitive data
- Log on every request (morgan already does this)
- Mix multiple concerns in one log message
- Use debug logs for user-facing errors

## Examples in This Service

### Login Success
```javascript
logger.info('User logged in successfully', { email: user.email, userId: user._id });
```

### Failed Authentication
```javascript
logger.warn('Login failed: invalid credentials', { email, reason: 'wrong_password' });
```

### System Error
```javascript
logger.error('Unhandled error', { message: err.message, stack: err.stack });
```

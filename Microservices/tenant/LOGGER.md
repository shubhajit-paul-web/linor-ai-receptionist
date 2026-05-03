# Tenant Service Logger

## Overview
The tenant service uses a simple, production-ready logger that replaces `console.log()` with structured logging at four levels: `debug`, `info`, `warn`, and `error`.

## Features
- ✅ **Log Levels**: debug, info, warn, error
- ✅ **Colored Output**: Terminal colors for easy readability
- ✅ **Timestamps**: HH:mm:ss.SSS format with milliseconds
- ✅ **Structured Data**: Pass contextual data as second parameter
- ✅ **Environment Control**: Set `LOG_LEVEL` env var to control verbosity
- ✅ **No Dependencies**: Uses only Node.js built-ins

## Usage

### Basic Usage
```javascript
const logger = require('./src/utils/logger');

logger.info('Clinic profile retrieved');
logger.warn('Failed to find clinic');
logger.error('Database connection failed');
logger.debug('Processing request', { requestId: '123' });
```

### With Structured Data
```javascript
logger.info('Clinic profile created', { 
  userId: '456', 
  clinicName: 'Main Clinic',
  isComplete: true 
});

logger.error('Profile update failed', { 
  userId: '123', 
  error: error.message 
});
```

## Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| **debug** | Development & detailed tracing | `logger.debug('Processing...', { step: 1 })` |
| **info** | Important business events | `logger.info('Clinic created', { userId: '123' })` |
| **warn** | Potential issues, but recoverable | `logger.warn('Profile not found', { userId: '456' })` |
| **error** | Critical failures | `logger.error('DB connection failed', { host: 'mongodb...' })` |

## Configuration

### Environment Variable: LOG_LEVEL
Control what gets logged by setting `LOG_LEVEL` in your `.env`:

```bash
# Production (only warnings and errors)
LOG_LEVEL=warn

# Staging (all logs including debug)
LOG_LEVEL=debug

# Development (default info and above)
LOG_LEVEL=info
```

## Output Examples

### Development (with colors in terminal)
```
[10:45:23.456] INFO    Clinic profile retrieved {"userId":"123abc","clinicName":"Main Clinic"}
[10:45:24.789] WARN    Failed login attempt {"email":"user@example.com"}
[10:45:25.012] ERROR   Database connection failed {"message":"ECONNREFUSED"}
[10:45:26.345] DEBUG   Token verified {"userId":"123abc"}
```

### Log Format
```
[HH:mm:ss.SSS] LEVEL message {"metadata":"structured data"}
```

## Where Logging is Used

- **server.js**: Server startup and shutdown events
- **db/db.js**: Database connection success/failure
- **Controllers/tenant.controller.js**: Profile operations (get, update, regenerate API key)
- **Routes/tenants.route.js**: ImageKit authentication errors
- **Middlewares/auth.middleware.js**: JWT validation and authentication failures
- **Services/imagekit.service.js**: ImageKit initialization and configuration

## Best Practices

1. **Use appropriate log levels**:
   - `info` for normal operations (profile retrieved, API key generated)
   - `warn` for recoverable issues (profile not found, validation failed)
   - `error` for critical failures (database down, integration errors)
   - `debug` for development/tracing only

2. **Include relevant context**:
   ```javascript
   // ✅ Good: includes userId for correlation
   logger.info('Profile updated', { userId: user_id, clinicName: clinic.clinicName });
   
   // ❌ Poor: no context for debugging
   logger.info('Profile updated');
   ```

3. **Don't log sensitive data**:
   ```javascript
   // ❌ Bad: logging password
   logger.debug('Login attempt', { email, password });
   
   // ✅ Good: log only safe identifiers
   logger.info('Login attempt', { email, timestamp: new Date() });
   ```

4. **Use structured data for errors**:
   ```javascript
   logger.error('Operation failed', {
     userId: user_id,
     operation: 'updateProfile',
     message: err.message,
     code: err.code
   });
   ```

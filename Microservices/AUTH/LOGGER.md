# Logger Implementation

## Overview
The AUTH microservice uses a Winston-backed logger facade with the same `debug`, `info`, `warn`, and `error` call pattern already used across the codebase.

## Features
- Log levels: `debug`, `info`, `warn`, `error`
- Colored console output in development
- Structured metadata as the second argument
- File output under `logs/auth.log` and `logs/auth.error.log`
- `LOG_LEVEL` support for verbosity control

## Usage

```javascript
const logger = require('./src/utils/logger.js');

logger.info('User login successful');
logger.warn('Failed login attempt');
logger.error('Database connection failed');
logger.debug('Processing request', { requestId: '123' });
```

## Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| `debug` | Development and detailed tracing | `logger.debug('Processing...', { step: 1 })` |
| `info` | Important business events | `logger.info('User logged in', { userId: '123' })` |
| `warn` | Recoverable issues | `logger.warn('Failed login', { email: 'user@example.com' })` |
| `error` | Critical failures | `logger.error('DB connection failed', { host: 'mongodb...' })` |

## Configuration

### Environment Variable: `LOG_LEVEL`

```bash
LOG_LEVEL=warn
LOG_LEVEL=debug
LOG_LEVEL=info
```

## Where Logger is Used

- `server.js`: startup and unhandled rejection logs
- `src/db/db.js`: database connection logs
- `src/config/env.js`: environment validation logs
- `src/Controllers/auth.controller.js`: auth flow events
- `src/Middlewares/auth.middleware.js`: token verification logs
- `src/Middlewares/error.middleware.js`: error handling logs

## Notes

- Do not log passwords or other secrets.
- `morgan` still handles request-level HTTP logging.

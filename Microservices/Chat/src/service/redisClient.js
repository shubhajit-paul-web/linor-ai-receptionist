const Redis = require("ioredis");
const logger = require("../utils/logger");

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => {
    if (times > 3) {
      logger.error("Redis connection failed after 3 retries");
      return null;
    }
    return Math.min(times * 200, 1000);
  },
  lazyConnect: true,
});

redis.on("connect", () => logger.info("Redis connected"));
redis.on("error", (err) => logger.error("Redis error: %s", err.message));

module.exports = redis;
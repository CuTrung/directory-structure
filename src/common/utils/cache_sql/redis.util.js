const connectRedis = async ({
  host = DEFAULT_DB_HOST,
  user = "default",
  password,
  database,
  ...options
} = {}) => {
  try {
    const Redis = require("ioredis");
    db.redis = new Redis({ host, user, ...options });
    console.log(">>> Connect Redis success");
  } catch (error) {
    console.log(">>> error", error);
  }
};
module.exports = { connectRedis };

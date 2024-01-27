const connectMongo = async ({
  host = DEFAULT_DB_HOST,
  user,
  password,
  database,
  ...options
} = {}) => {
  try {
    const mongoose = require("mongoose");
    await mongoose.connect(`mongodb://${host}:27017/${database}`);
    db.mongoDB = mongoose;
    console.log(">>> Connect MongoDB success");
  } catch (error) {
    console.log(">>> error", error);
  }
};
module.exports = { connectMongo };

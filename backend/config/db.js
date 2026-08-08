const mongoose = require("mongoose");

// Cache the connection across invocations. This matters on serverless platforms
// (Vercel) where the module can be reused between function calls - without this
// cache, every request could try to open a brand new MongoDB connection.
let cached = global._velouraMongooseConn;
if (!cached) {
  cached = global._velouraMongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not defined in .env");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB connected: ${cached.conn.connection.host}`);
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;

import mongoose from 'mongoose';

// On Vercel every request can hit a cold or warm serverless instance. Opening a
// brand new Mongo connection per request exhausts the Atlas connection limit
// very quickly, so the connection (and the in-flight promise) is cached on the
// global object, which survives between warm invocations.
const globalForMongoose = globalThis;
const cached = globalForMongoose._bpMongoose || { conn: null, promise: null };
globalForMongoose._bpMongoose = cached;

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not set');
    }

    cached.promise = mongoose
      .connect(uri, {
        // Fail fast instead of hanging until the serverless function times out.
        serverSelectionTimeoutMS: 10000,
        // Without a persistent process, buffering just hides connection errors.
        bufferCommands: false,
      })
      .then((m) => {
        console.log(`MongoDB Connected: ${m.connection.host}`);
        return m;
      })
      .catch((error) => {
        // Clear the promise so the next request retries instead of reusing a
        // permanently rejected one.
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;

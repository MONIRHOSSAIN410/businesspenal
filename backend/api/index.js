// Vercel serverless entry point for the Business Panel API.
//
// Vercel does not run `server.js` (it never keeps a long-lived process alive).
// Instead it invokes this file as a function for every incoming request, so we
// hand the request off to the same Express app that `server.js` uses locally.
//
// `connectDB()` caches the Mongoose connection on `globalThis`, so warm
// invocations reuse the existing socket instead of dialing Atlas every time.
import app from '../app.js';
import connectDB from '../config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error('DB connection failed:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        message: 'Database connection failed. Check MONGO_URI and Atlas IP access list.',
      })
    );
    return;
  }

  return app(req, res);
}

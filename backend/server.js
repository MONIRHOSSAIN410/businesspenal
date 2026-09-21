// Local / long-running host entry point (node server.js).
// On Vercel this file is never executed - api/index.js is the entry instead.
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5011;

const start = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Business Panel API listening on port ${PORT}`);
  });
};

start();

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

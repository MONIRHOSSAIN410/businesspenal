import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5011;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Business Panel API listening on port ${PORT}`);
  });
};

start();

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

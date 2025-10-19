import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { scheduleEmailReminders, runTestReminders } from './src/services/scheduler.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  try {
    await connectDB(MONGO_URI);
    
    // Start email reminder scheduler
    scheduleEmailReminders();
    
    // Run test reminders in development
    await runTestReminders();
    
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

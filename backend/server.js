const app = require('./src/app');
const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ Connected to DB");
  } catch (error) {
    console.error("❌ DB Connection failed", error);
  }
}

connectDB();

module.exports = app; // Vercel will use this as the handler
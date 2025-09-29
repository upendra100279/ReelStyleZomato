const app = require('./src/app');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to DB");
  } catch (error) {
    console.error("❌ DB Connection failed", error);
  }
};

connectDB(); 

const serverless = require('serverless-http');

module.exports = serverless(app); // ✅ Export Express as a handler

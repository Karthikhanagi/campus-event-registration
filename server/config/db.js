const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let mongoConnected = false;
const dataDir = path.join(__dirname, '../data');
const dataFilePath = path.join(dataDir, 'db.json');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_events';
  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });
    mongoConnected = true;
    console.log('>>> [DATABASE] Successfully connected to live MongoDB instance.');
  } catch (err) {
    mongoConnected = false;
    console.log('>>> [DATABASE] MongoDB service not reachable locally. Initializing built-in resilient file data store.');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify({ users: [], events: [], registrations: [] }, null, 2));
    }
  }
};

const isMongoActive = () => mongoConnected;

module.exports = {
  connectDB,
  isMongoActive,
  dataFilePath
};

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Queue = require('../models/Queue');
const Token = require('../models/Token');

dotenv.config({ path: '../.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/queue-management');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    await Queue.deleteMany();
    await Token.deleteMany();

    const queues = [
      { serviceName: 'Aadhaar Update', counterNumber: '03', maxCapacity: 50, tokenPrefix: 'AAD' },
      { serviceName: 'Cash Deposit', counterNumber: '02', maxCapacity: 50, tokenPrefix: 'CAS' },
      { serviceName: 'Document Verification', counterNumber: '05', maxCapacity: 30, tokenPrefix: 'DOC' },
      { serviceName: 'Customer Support', counterNumber: '01', maxCapacity: 20, tokenPrefix: 'CUS' }
    ];

    await Queue.insertMany(queues);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedData();

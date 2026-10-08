const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

async function connectDb(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  await Appointment.syncIndexes();
  console.log('Connected to MongoDB');
}

module.exports = { connectDb };

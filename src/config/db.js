const mongoose = require('mongoose');
require('dotenv').config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('connect successfully!');
  } catch (error) {
    console.error('connect failure!');
  }
};

module.exports = { connect };

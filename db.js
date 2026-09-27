require('dotenv').config();
const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('MongoDB Connected');
});

db.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = db;
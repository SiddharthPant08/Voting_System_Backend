const express = require("express");
const app = express();
const db = require('./db');
const cors = require('cors');
require('dotenv').config();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use(cors({
  origin: 'https://voting-system-backend-1-35h6.onrender.com',
  credentials: true
}));

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on PORT ${PORT}`);
});
const express  = require("express");
const app = express();
const db = require('./db')
const cors = require('cors');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());  
const PORT = process.env.PORT||3000;
//Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
//use the routers
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);


app.listen(PORT, 'localhost', () => {
    console.log(`Server listening on PORT ${PORT}`);
});


// app.listen(PORT,()=>{
//     console.log("Server listening on PORT 3000")
// });
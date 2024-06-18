const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

require('../utils/scheduler');

// REST OBJECT
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ROUTES
app.use('/api/v1/auth', require('./routes/userRoutes'));
app.use('/api/v1/transaction',require('./routes/transactionRoutes'));
app.use('/api/v1/income',require('./routes/incomeRoutes'));
app.use('/api/v1/stock', require('./routes/stockRoutes'));

// HOME
app.get("/", (req, res) => {
    res.status(200).send({
        "success": true,
        "msg": "Node Server Running"
    })
})

// PORT
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {
    console.log(`Server Running ${PORT}`.bgGreen.white);
})
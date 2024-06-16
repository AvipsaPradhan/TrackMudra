const express = require('express');
const { requireSignIn } = require('../controllers/userController');
const Stock = require('../models/stockModel');

const router = express.Router();

// Get all stock data
router.get('/stocks', requireSignIn, async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ date: -1 });
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stock data', error });
  }
});

module.exports = router;

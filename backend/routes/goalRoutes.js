const express = require('express');
const { requireSignIn } = require('../controllers/userController');
const { addGoal, getGoals, markedGoals, getCompletedGoals } = require('../controllers/goalController');

const router = express.Router();

// Add goal
router.post('/add-goal', requireSignIn, addGoal);

// Get user goals
router.get('/get-goal', requireSignIn, getGoals);

// Mark goal as completed
router.post('/mark-completed/:goalId', requireSignIn, markedGoals);

// Get completed goals
router.get('/get-completed-goals', requireSignIn,getCompletedGoals);

module.exports = router;

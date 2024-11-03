const express = require('express');
const Goal = require('../models/Goal');
const { isAuthenticated } = require('./auth'); 

const router = express.Router();

// Create Goal
router.post('/', isAuthenticated, async (req, res) => {
    const { title, description, goalType, target } = req.body;
    try {
        const newGoal = new Goal({ userId: req.userId, title, description, goalType, target });
        await newGoal.save();
        res.status(201).json(newGoal);
    } catch (error) {
        res.status(500).json({ message: 'Error creating goal' });
    }
});

// Get Goals
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.userId });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching goals' });
    }
});

// Update Goal
router.put('/:id', isAuthenticated, async (req, res) => {
    const { title, description, goalType, target } = req.body;
    try {
        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, { title, description, goalType, target }, { new: true });
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal' });
    }
});

// Delete Goal
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting goal' });
    }
});

module.exports = router;

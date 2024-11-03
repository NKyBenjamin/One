const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Middleware for session-based authentication
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        req.userId = req.session.userId; 
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { username, password, fname, lname, email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            fname,
            lname,
            email
        });

        await newUser.save();
        res.status(201).json({ message: 'Registration successful' });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Set session for logged-in user
        req.session.userId = user._id;
        return res.status(200).json({ 
            message: 'Login successful', 
            fname: user.fname 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Get User Information
router.get('/user', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId, 'fname'); // Fetch only fname
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user); // Send the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

// Export the router
module.exports = { router, isAuthenticated };

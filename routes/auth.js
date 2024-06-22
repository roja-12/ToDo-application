// Manages user registration, login, and logout routes, including handling user creation, session management, and error responses.

const express = require('express'); // Import the express library
const User = require('../models/user'); // Import the User model
const bcrypt = require('bcryptjs'); // Import bcryptjs for password comparison

const router = express.Router(); // Create a new router object

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body; // Destructure username and password from the request body
        const existingUser = await User.findOne({ username }); // Check if the username already exists
        if (existingUser) {
            return res.status(400).send('Username already taken'); // Return an error if the username is taken
        }
        const user = new User({ username, password }); // Create a new user with the provided username and password
        await user.save(); // Save the new user to the database
        req.session.userId = user._id; // Store the user ID in the session
        res.status(201).send('User registered successfully'); // Send a success response
    } catch (error) {
        res.status(500).send(error.message); // Send an error response if something goes wrong
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body; // Destructure username and password from the request body
        const user = await User.findOne({ username }); // Find the user by username
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send('Invalid credentials'); // Return an error if the credentials are invalid
        }
        req.session.userId = user._id; // Store the user ID in the session
        res.status(200).send('Login successful'); // Send a success response
    } catch (error) {
        res.status(500).send(error.message); // Send an error response if something goes wrong
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(() => { // Destroy the session
        res.redirect('/login'); // Redirect to the login page
    });
});

module.exports = router; // Export the router for use in other parts of the application

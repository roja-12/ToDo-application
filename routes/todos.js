// Handles CRUD operations for todo items, including creating, reading, updating (toggling completion), and deleting todos, with middleware to check user authentication.

const express = require('express'); // Import the express library
const Todo = require('../models/todo'); // Import the Todo model

const router = express.Router(); // Create a new router object

// Middleware to check if user is logged in
function loggedIn(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).send('Login required'); // If user is not logged in, send a 401 status
    }
    next(); // Proceed to the next middleware or route handler
}

// Route to get all todos for the logged-in user
router.get('/', loggedIn, async (req, res) => {
    try {
        const todos = await Todo.find({ owner: req.session.userId }); // Find todos belonging to the logged-in user
        res.json(todos); // Send the todos as a JSON response
    } catch (error) {
        res.status(500).send('Server error'); // Send a 500 status on server error
    }
});

// Route to create a new todo
router.post('/', loggedIn, async (req, res) => {
    const { description } = req.body; // Destructure description from the request body
    const todo = new Todo({
        description,
        owner: req.session.userId // Set the owner to the logged-in user's ID
    });
    await todo.save(); // Save the new todo to the database
    res.status(201).json(todo); // Send the created todo as a JSON response with a 201 status
});

// Route to toggle the completion status of a todo
router.post('/toggle/:id', loggedIn, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id); // Find the todo by its ID
        if (!todo) {
            return res.status(404).send('Todo not found.'); // Send a 404 status if the todo is not found
        }
        todo.completed = !todo.completed; // Toggle the completion status
        await todo.save(); // Save the updated todo to the database
        res.json(todo); // Send the updated todo as a JSON response
    } catch (error) {
        res.status(500).send('Error toggling todo'); // Send a 500 status on error
    }
});

// Route to delete a todo
router.delete('/:id', loggedIn, async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id); // Find and delete the todo by its ID
        if (!result) {
            return res.status(404).send('Todo not found.'); // Send a 404 status if the todo is not found
        }
        res.status(200).send({ message: 'Deleted successfully' }); // Send a success message with a 200 status
    } catch (error) {
        res.status(500).send('Error deleting todo'); // Send a 500 status on error
    }
});

module.exports = router; // Export the router for use in other parts of the application

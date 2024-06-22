// Defines the Mongoose schema and model for the todo items, specifying fields for description, completion status, and owner.

const mongoose = require('mongoose'); // Import the mongoose library for MongoDB interaction

// Define the schema for a todo item with three fields: description, completed, and owner
const todoSchema = new mongoose.Schema({
    description: { type: String, required: true }, // The description of the todo item, required
    completed: { type: Boolean, default: false }, // Boolean flag indicating if the todo is completed, default is false
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the owner (User) of the todo item
});

// Create a Mongoose model named 'Todo' using the todoSchema
const Todo = mongoose.model('Todo', todoSchema);

// Export the Todo model for use in other parts of the application
module.exports = Todo;

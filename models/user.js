// Defines the Mongoose schema and model for users, including fields for username and password, and includes password hashing middleware.

const mongoose = require('mongoose'); // Import the mongoose library for MongoDB interaction
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

// Define the schema for a user with two fields: username and password
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // The username, required and unique
    password: { type: String, required: true } // The password, required
});

// Middleware to hash the password before saving a user document
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // If the password is not modified, skip to the next middleware
    this.password = await bcrypt.hash(this.password, 8); // Hash the password with a salt factor of 8
    next(); // Call the next middleware
});

// Create a Mongoose model named 'User' using the userSchema
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;

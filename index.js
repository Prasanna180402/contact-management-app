require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // For logging
const contactRoutes = require('./routes/contacts');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // Concise logging for development
app.use(bodyParser.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if connection fails (important!)
});

// Routes
app.use('/contacts', contactRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full error stack for debugging

    const statusCode = err.statusCode || 500; // Use custom status code if available
    const message = err.message || 'Something went wrong!'; // Custom message or default

    res.status(statusCode).json({ message }); // Send a JSON error response
});

// Start Server
const server = app.listen(PORT, () => { // Store server object for testing
    console.log(`Server listening on port ${PORT}`);
});

module.exports = { app, server }; // Export for testing
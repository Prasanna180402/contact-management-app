class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500; // Default 500
        Error.captureStackTrace(this, this.constructor); // Proper stack traces
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

module.exports = { AppError, NotFoundError, ValidationError };
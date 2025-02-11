const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Contact = require('../models/Contact');
const { NotFoundError, ValidationError } = require('../utils/errors'); // Custom errors

// Validation Schema (More Robust)
const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().regex(/^\d{10}$/).required().messages({ 'string.pattern.base': 'Phone number must be 10 digits' }), // Regex for phone number
    address: Joi.string().optional(),
});

// ... (GET all contacts - same as before)

// POST new contact
router.post('/', async (req, res, next) => {
    try {
        const { error } = contactSchema.validate(req.body);
        if (error) {
            throw new ValidationError(error.details[0].message); // Throw custom error
        }

        const newContact = new Contact(req.body);
        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (err) {
        next(err); // Pass error to the error handling middleware
    }
});

// ... (GET single contact - with better error handling)
router.get('/:id', async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            throw new NotFoundError('Contact not found'); // Custom error
        }
        res.json(contact);
    } catch (err) {
        next(err);
    }
});


// ... (PUT update contact - similar error handling)

// ... (DELETE contact - similar error handling)


module.exports = router;

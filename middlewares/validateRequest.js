const { validationResult } = require('express-validator');

const validateRequest = (validations) => {
    return async (req, res, next) => {
        try {
            // If no validations provided, continue
            if (!validations) {
                return next();
            }

            const errors = [];

            // Check each field against its validation rules
            for (const [field, rules] of Object.entries(validations)) {
                const value = req.body[field];

                // Required field check
                if (rules.notEmpty && (!value || value.toString().trim() === '')) {
                    errors.push({
                        field,
                        message: rules.errorMessage || `${field} is required`
                    });
                    continue;
                }

                // Email validation
                if (rules.isEmail && value) {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(value)) {
                        errors.push({
                            field,
                            message: rules.errorMessage || 'Invalid email format'
                        });
                    }
                }

                // Length validation
                if (rules.isLength && value) {
                    const { min, max } = rules.isLength.options || {};
                    if (min && value.length < min) {
                        errors.push({
                            field,
                            message: rules.errorMessage || `${field} must be at least ${min} characters`
                        });
                    }
                    if (max && value.length > max) {
                        errors.push({
                            field,
                            message: rules.errorMessage || `${field} must not exceed ${max} characters`
                        });
                    }
                }

                // Enum validation
                if (rules.isIn && value) {
                    const validValues = rules.isIn.options[0];
                    if (!validValues.includes(value)) {
                        errors.push({
                            field,
                            message: rules.errorMessage || `Invalid ${field} value`
                        });
                    }
                }
            }

            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    errors
                });
            }

            // If validation passes, continue
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = validateRequest;
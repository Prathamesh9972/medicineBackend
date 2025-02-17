const express = require('express');
const { register, login } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const router = express.Router();

// Define validation schemas
const registerSchema = {
    name: {
        trim: true,
        notEmpty: {
            errorMessage: 'Name is required'
        }
    },
    email: {
        isEmail: {
            errorMessage: 'Valid email is required'
        },
        normalizeEmail: true
    },
    password: {
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters long'
        }
    },
    role: {
        optional: true,
        isIn: {
            options: [['admin', 'supplier', 'manufacturer', 'distributor', 'enduser']],
            errorMessage: 'Invalid role specified'
        }
    }
};

const loginSchema = {
    email: {
        isEmail: {
            errorMessage: 'Valid email is required'
        },
        normalizeEmail: true
    },
    password: {
        notEmpty: {
            errorMessage: 'Password is required'
        }
    }
};

// Auth Routes
router.post(
    '/register',
    validateRequest(registerSchema),
    register
);

router.post(
    '/login',
    validateRequest(loginSchema),
    login
);

// Get current user profile
router.get(
    '/me',
    authMiddleware,
    (req, res) => {
        res.json({ user: req.user });
    }
);

module.exports = router;

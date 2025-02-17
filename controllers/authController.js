const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Input validation helper
const validateInput = (data) => {
    const { name, email, password } = data;
    if (!email || !password) {
        return 'Email and password are required';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters';
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
        return 'Please enter a valid email';
    }
    return null;
};

// JWT token generator
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        const validationError = validateInput({ name, email, password });
        if (validationError) {
            return res.status(400).json({ msg: validationError });
        }

        // Check for existing user
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user' // Default role if not specified
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide email and password' });
        }

        // Find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        // Remove password from response
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.json({
            token,
            user: userResponse
        });

    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ msg: 'Server error during login' });
    }
};

// Optional: Password reset functionality
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Here you would typically:
        // 1. Generate a password reset token
        // 2. Save it to the user document with an expiry
        // 3. Send an email with reset instructions
        
        res.json({ msg: 'Password reset instructions sent to email' });
    } catch (err) {
        console.error('Password reset error:', err.message);
        res.status(500).json({ msg: 'Server error during password reset' });
    }
};
const User = require('../models/User');

exports.getDistributors = async (req, res) => {
    try {
        const distributors = await User.find({ role: 'distributor' });
        res.json(distributors);
    } catch (err) {
        console.error('Error fetching distributors:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await User.find({ role: 'supplier' });
        res.json(suppliers);
    } catch (err) {
        console.error('Error fetching suppliers:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getManufacturers = async (req, res) => {
    try {
        const manufacturers = await User.find({ role: 'manufacturer' });
        res.json(manufacturers);
    } catch (err) {
        console.error('Error fetching manufacturers:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

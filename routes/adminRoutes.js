const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const jwt = require('jsonwebtoken');

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.get('/distributors', authenticateToken, adminController.getDistributors);
router.get('/suppliers', authenticateToken, adminController.getSuppliers);
router.get('/manufacturers', authenticateToken, adminController.getManufacturers);
router.delete('/:type/:id', authenticateToken, adminController.deleteUser);
router.post('/', authenticateToken, adminController.createUser);
router.put('/:id', authenticateToken, adminController.updateUser);

module.exports = router;

const express = require('express');
const { addMedicine, updateMedicineStatus, sellMedicine, getMedicineDetails } = require('../controllers/medicineController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to add medicine (only accessible by supplier)
router.post('/add', authMiddleware, addMedicine);

// Route to update the status of a medicine
router.put('/status', authMiddleware, updateMedicineStatus);

// Route to sell medicine (only accessible by distributor)
router.put('/sell', authMiddleware, sellMedicine);

// Route to get medicine details
router.get('/:batchId', getMedicineDetails);

module.exports = router;

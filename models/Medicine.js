// models/Medicine.js
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    batchId: { type: String, required: true, unique: true },
    supplier: { type: String, required: true },
    manufacturer: { type: String, required: true },
    distributor: { type: String, required: true },
    qrCode: { type: String, required: true },
    status: { type: String, default: 'inProduction' },
    enduser: { type: String, default: null },
    transactionHash: { type: String, required: true },
    saleHash: { type: String, default: null },
    lastUpdateHash: { type: String, default: null }
});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = { Medicine };

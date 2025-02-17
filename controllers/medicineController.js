// controllers/MedicineController.js
const web3 = require('../config/blockchain');
const { Medicine } = require('../models/Medicine'); // MongoDB model
const contractABI = [/* your contract ABI here */];
const contractAddress = '<your_contract_address>'; // Update with your contract address

// Instantiate the contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to add medicine
exports.addMedicine = async (req, res) => {
    const { name, batchId, supplier, manufacturer, distributor, qrCode } = req.body;

    try {
        // Check for existing medicine
        const existingMedicine = await Medicine.findOne({ batchId });
        if (existingMedicine) {
            return res.status(400).json({ msg: 'Medicine with this batchId already exists' });
        }

        // Get the sender's Ethereum account
        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
            return res.status(400).json({ msg: 'No Ethereum accounts available' });
        }
        const senderAddress = accounts[0];

        // Add medicine to blockchain
        const result = await contract.methods.addMedicine(
            name,
            batchId,
            supplier,
            manufacturer,
            distributor,
            qrCode
        ).send({ 
            from: senderAddress,
            gas: 3000000
        });

        // Save to MongoDB
        const newMedicine = new Medicine({
            name,
            batchId,
            supplier,
            manufacturer,
            distributor,
            qrCode,
            status: 'inProduction',
            transactionHash: result.transactionHash
        });
        await newMedicine.save();

        res.status(201).json({ 
            msg: 'Medicine added successfully',
            transactionHash: result.transactionHash
        });
    } catch (err) {
        console.error('Error adding medicine:', err);
        res.status(500).json({ 
            msg: 'Server error while adding medicine',
            error: err.message 
        });
    }
};

// Function to update medicine status
exports.updateMedicineStatus = async (req, res) => {
    const { batchId, status } = req.body;

    try {
        const existingMedicine = await Medicine.findOne({ batchId });
        if (!existingMedicine) {
            return res.status(400).json({ msg: 'Medicine not found' });
        }

        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
            return res.status(400).json({ msg: 'No Ethereum accounts available' });
        }
        const senderAddress = accounts[0];

        const result = await contract.methods.updateStatus(batchId, status)
            .send({ 
                from: senderAddress,
                gas: 3000000
            });

        existingMedicine.status = status;
        existingMedicine.lastUpdateHash = result.transactionHash;
        await existingMedicine.save();

        res.status(200).json({ 
            msg: `Status updated to ${status}`,
            transactionHash: result.transactionHash
        });
    } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).json({ 
            msg: 'Server error while updating status',
            error: err.message
        });
    }
};

// Function to sell medicine
exports.sellMedicine = async (req, res) => {
    const { batchId, enduser } = req.body;

    try {
        const existingMedicine = await Medicine.findOne({ batchId });
        if (!existingMedicine) {
            return res.status(400).json({ msg: 'Medicine not found' });
        }

        if (existingMedicine.enduser) {
            return res.status(400).json({ msg: 'Medicine already sold' });
        }

        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
            return res.status(400).json({ msg: 'No Ethereum accounts available' });
        }
        const senderAddress = accounts[0];

        const result = await contract.methods.sellMedicine(batchId, enduser)
            .send({ 
                from: senderAddress,
                gas: 3000000
            });

        existingMedicine.enduser = enduser;
        existingMedicine.status = 'sold';
        existingMedicine.saleHash = result.transactionHash;
        await existingMedicine.save();

        res.status(200).json({ 
            msg: 'Medicine sold successfully',
            transactionHash: result.transactionHash
        });
    } catch (err) {
        console.error('Error selling medicine:', err);
        res.status(500).json({ 
            msg: 'Server error while selling medicine',
            error: err.message
        });
    }
};

// Function to get medicine details
exports.getMedicineDetails = async (req, res) => {
    const { batchId } = req.params;

    try {
        const medicine = await contract.methods.getMedicineDetails(batchId).call();
        
        // Fetch additional details from MongoDB
        const localMedicine = await Medicine.findOne({ batchId });
        
        res.status(200).json({ 
            blockchainData: medicine,
            localData: localMedicine
        });
    } catch (err) {
        console.error('Error fetching medicine details:', err);
        res.status(500).json({ 
            msg: 'Error fetching medicine details',
            error: err.message
        });
    }
};

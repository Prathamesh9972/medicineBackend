const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
// const medicineRoutes = require('./routes/medicineRoutes');
const cors = require('cors'); // Import CORS
require('dotenv').config();

const app = express();
connectDB();

// Enable CORS
app.use(cors({
    origin: 'http://mystaticwebsitehosting19.s3-website.ap-south-1.amazonaws.com', // Allow frontend to access backend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Use admin routes
// app.use('/api/medicine', medicineRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

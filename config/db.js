require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Add retry mechanism for better reliability
            serverSelectionTimeoutMS: 5000,
            // Add auto index creation
            autoIndex: true,
            // Connection timeout
            connectTimeoutMS: 10000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Add error handlers for the connection
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
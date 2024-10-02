import mongoose from 'mongoose';
import { DB_ONE_NAME, DB_TWO_NAME } from '../constants.js';

// Function to connect to the first database (usersBooksDB)
const connectDBOne = async () => {
    try {
        const connectionInstance = await mongoose.createConnection(`${process.env.MONGODB_URL}/${DB_ONE_NAME}`);
        console.log(`\nMongo DB connection to ${DB_ONE_NAME} successful`);
        return connectionInstance; 
    } catch (error) {
        console.error("MongoDB connection to DB One failed", error);
        process.exit(1);
    }
};

// Function to connect to the second database (transactionsDB)
const connectDBTwo = async () => {
    try {
        const connectionInstance = await mongoose.createConnection(`${process.env.MONGODB_URL}/${DB_TWO_NAME}`);
        console.log(`\nMongo DB connection to ${DB_TWO_NAME} successful`);
        return connectionInstance;
    } catch (error) {
        console.error("MongoDB connection to DB Two failed", error);
        process.exit(1);
    }
};

// Export both functions
export { connectDBOne, connectDBTwo };

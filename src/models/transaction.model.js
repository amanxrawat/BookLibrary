import { connectDBTwo } from "../db/connection.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const transactionModel = async () => {
    const transactionsDB = await connectDBTwo();

    const transactionSchema = new mongoose.Schema({
        bookName: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        issueDate: { type: Date, required: true },
        returnDate: { type: Date },
        onRent:{type:Boolean, default:false},
        totalRent: { type: Number, default: 0 } // Field to store total rent
    }, { timestamps: true });


    const Transaction = transactionsDB.model('Transaction', transactionSchema);

    return Transaction ;  
};



export default transactionModel;

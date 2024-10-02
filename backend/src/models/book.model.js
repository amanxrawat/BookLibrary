import { connectDBOne } from "../db/connection.js";
import mongoose from "mongoose";
const bookModel = async () => {
    const usersBooksDB = await connectDBOne();  

    // Book Schema
    const bookSchema = new mongoose.Schema({
        bookName: {
            type:String,
            required:true
        },
        category: {
            type:String,
            required:true
        },
        rentPerDay: {
            type:Number,
            required:true
        }
    });

    const Book = usersBooksDB.model('Book', bookSchema);

    return Book ; 
};

export default bookModel;

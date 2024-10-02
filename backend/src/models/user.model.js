import { connectDBOne } from "../db/connection.js";
import mongoose from "mongoose";
const userModel = async () => {
    const usersBooksDB = await connectDBOne();  // Get the connection instance

    // Define User Schema
    const userSchema = new mongoose.Schema({
        name:{
            type:String,
            requried:true
        },
        email: {
            type:String,
            default:''
        },
        phone:{
            type:String,
            default:''
        }
    }); 

    const User = usersBooksDB.model('User', userSchema);

    return  User; 
};

export default userModel;

import { asyncHandler } from '../utils/asyncHandler.js'; // Assuming you have an asyncHandler utility
import { ApiError } from '../utils/ApiError.js'; // Assuming you have an ApiError utility
import { ApiResponse } from '../utils/ApiResponse.js'; // Assuming you have an ApiResponse utility
import userModel from '../models/user.model.js'; // Import user model

const createUser = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    // Input validation
    if (!name || !email || !phone) {
        throw new ApiError(400, 'Name, email, and phone are required.');
    }

    const User = await userModel(); // Get the user model
    const existingUser = await User.findOne({ email }); // Check if user already exists

    if (existingUser) {
        throw new ApiError(400, 'User already exists with this email.');
    }

    const newUser = new User({ name, email, phone }); // Create a new user instance
    await newUser.save(); // Save the user to the database

    res.status(201).json(new ApiResponse(201, 'User created successfully', newUser)); // Respond with success message
});


const getAllUser = asyncHandler(async(req,res)=>{
   try {
     const user = await userModel();
     const allUsers = await user.find();
 
     return res.status(200).json(new ApiResponse(200,"All users fetched successfully ",allUsers))
   } catch (error) {
        console.log("error finding all users",error);
        throw new ApiError(500,"unable to get users ");
   }

})

export { createUser , getAllUser };

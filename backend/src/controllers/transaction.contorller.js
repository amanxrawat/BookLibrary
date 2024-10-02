import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'; 
import { ApiResponse } from '../utils/ApiResponse.js'; 
import transactionModel from '../models/transaction.model.js'; 
import userModel from '../models/user.model.js'; 
import bookModel from '../models/book.model.js'; 
import moment from 'moment'; 


const issueBook = asyncHandler(async (req, res) => {
    const { bookName, userId, issueDate } = req.body; 

    if (!bookName || !userId || !issueDate) {
        throw new ApiError(400, 'Book name, user ID, and issue date are required.');
    }

    const User = await userModel(); 
    const user = await User.findById(userId); 

    if (!user) {
        throw new ApiError(404, 'User not found.');
    }

    const Book = await bookModel(); 
    const book = await Book.findOne({ bookName }); 

    if (!book) {
        throw new ApiError(404, 'Book not found.');
    }

    // Create a new transaction
    const Transaction = await transactionModel();
    const newTransaction = new Transaction({
        bookName,
        userId,
        issueDate: new Date(issueDate),
        returnDate: null, 
        onRent:true
    });

    await newTransaction.save(); // Save the transaction

    res.status(201).json(new ApiResponse(201, 'Book issued successfully.', newTransaction)); 
});


const returnBook = asyncHandler(async (req, res) => {
    const { bookName, userId, returnDate } = req.body; 

    // Input validation
    if (!bookName || !userId || !returnDate) {
        throw new ApiError(400, 'Book name, user ID, and return date are required.');
    }

    const Transaction = await transactionModel(); 
    const transaction = await Transaction.findOne({
        bookName,
        userId,
        returnDate: null,
    });

    if (!transaction) {
        throw new ApiError(404, 'No active transaction found for this book and user.');
    }

    
    const issueDate = moment(transaction.issueDate);
    const returnMoment = moment(returnDate);
    const daysRented = returnMoment.diff(issueDate, 'days'); 
    const rentPerDay = await (await bookModel()).findOne({ bookName }).select('rentPerDay'); 

    const totalRent = (daysRented +1) * rentPerDay.rentPerDay; // Calculate total rent

    // Update the transaction with return date and total rent
    transaction.returnDate = new Date(returnDate);
    transaction.totalRent = totalRent; 
    transaction.onRent = false;
    await transaction.save(); 

    res.status(200).json(new ApiResponse(200, 'Book returned successfully.', transaction)); // Respond with success
});


const getBookIssueDetails = asyncHandler(async (req, res) => {
    const { bookName } = req.params;

    
    if (!bookName) {
        throw new ApiError(400, 'Book name is required.');
    }

    const Transaction = await transactionModel(); 

    // Fetch all transactions for the given book name
    const transactions = await Transaction.find({ bookName });

    if (!transactions || transactions.length === 0) {
        throw new ApiError(404, 'No transactions found for this book.');
    }

    const User = await userModel(); 

    // Find all unique user IDs who have issued the book in the past
    const pastUsers = await Promise.all(
        transactions.map(async (transaction) => {
            return await User.findById(transaction.userId).select('name');
        })
    );

    // Filter transactions to find the currently issued one (i.e., where returnDate is null)
    const currentTransaction = await transactions.find(transaction => !transaction.returnDate);

    let currentIssuer = null;
    let status = 'Not issued at the moment';

    if (currentTransaction) {
        currentIssuer = await User.findById(currentTransaction.userId).select('name'); 
        status = 'Currently issued';
    }

    const totalCount = transactions.length; 

    res.status(200).json(new ApiResponse(200, 'Book issue details fetched successfully.', {
        totalCount,
        pastUsers,
        currentIssuer,
        status
    }));
});


const totalRentGenerated = asyncHandler(async(req,res)=>{
    const {bookName} = req.params;

    if(!bookName){
        throw new ApiError(400,'book name is required')
    }
    const Transaction = await transactionModel();
    const allTransaction = await Transaction.find({bookName:bookName});

    let totalRentGen = 0;

    allTransaction.forEach(entry => {
        totalRentGen += entry.totalRent;
    });

    return res.status(200).json(
        new ApiResponse(200,'total rent calculated successfully',totalRentGen)
    )


})


const getBooksIssuedToUser = asyncHandler(async (req, res) => {
    const { userId, name } = req.query; // Get userId or name from query params

    if (!userId && !name) {
        throw new ApiError(400, 'Either userId or name is required.');
    }

    const User = await userModel(); // Get user model

    // Find the user either by userId or name
    let user;
    if (userId) {
        user = await User.findById(userId);
    } else if (name) {
        user = await User.findOne({ name });
    }

    if (!user) {
        throw new ApiError(404, 'User not found.');
    }

    const Transaction = await transactionModel(); // Get transaction model

    // Fetch all transactions for the user
    const userTransactions = await Transaction.find({ userId: user._id });

    if (!userTransactions || userTransactions.length === 0) {
        throw new ApiError(404, 'No books issued to this user.');
    }

    // Map the transactions to retrieve book names and other relevant info
    const issuedBooks = userTransactions.map(transaction => {
        return {
            bookName: transaction.bookName,
            issueDate: transaction.issueDate,
            returnDate: transaction.returnDate || 'Not yet returned' // Handle books not returned yet
        };
    });

    res.status(200).json(
        new ApiResponse(200, 'Books issued to the user fetched successfully.', issuedBooks)
    );
});


const getBooksIssuedInDateRange = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.body; // Extract startDate and endDate from query params

    if (!startDate || !endDate) {
        throw new ApiError(400, 'Both startDate and endDate are required.');
    }

    // Ensure the dates are valid and in correct format
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ApiError(400, 'Invalid date format.');
    }

    const Transaction = await transactionModel(); // Get transaction model

    // Fetch all transactions where the issueDate is within the given date range
    const transactionsInRange = await Transaction.find({
        issueDate: { $gte: start, $lte: end }
    });

    if (!transactionsInRange || transactionsInRange.length === 0) {
        throw new ApiError(404, 'No books issued in this date range.');
    }

    // Fetch the users related to these transactions
    const User = await userModel();
    const result = [];

    for (const transaction of transactionsInRange) {
        const user = await User.findById(transaction.userId); // Assuming `userId` is stored in transaction
        result.push({
            bookName: transaction.bookName,
            issueDate: transaction.issueDate,
            userName: user ? user.name : 'Unknown user'
        });
    }

    res.status(200).json(
        new ApiResponse(200, 'Books issued in the given date range fetched successfully.', result)
    );
});


export { issueBook , returnBook ,  getBookIssueDetails , totalRentGenerated , getBooksIssuedToUser, getBooksIssuedInDateRange};

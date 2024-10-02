import express from 'express'
import bookModel from '../models/book.model.js'
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const book = await bookModel();


const getAllBooks = asyncHandler(async (req, res) => {
    try {
        const books = await book.find();

        if (!books || books.length === 0) {
            throw new ApiError(404, 'No books found');
        }

        res.status(200).json(new ApiResponse(200, 'Books retrieved successfully', books));
    } catch (error) {
        console.log(error)
        throw new ApiError(500, 'Error retrieving books');
    }
});

const createBook = asyncHandler(async (req, res) => {
    const { bookName, category, rentPerDay } = req.body;

    console.log(bookName  + category + rentPerDay);
    // Input validation
    if (!bookName || !category || !rentPerDay) {
        throw new ApiError(400, 'Book name, category, and rent per day are required.');
    }

    
    const newBook = new book({ bookName, category, rentPerDay }); 
    await newBook.save(); 

    res.status(201).json(new ApiResponse(201, 'Book created successfully', newBook)); // Respond with success message
});

const searchBooks = asyncHandler(async (req, res) => {
    const { query } = req.body; 

    if (!query) {
        throw new ApiError(400, 'Search query is required.');
    }

    const books = await book.find({ bookName: { $regex: query, $options: 'i' } }); 

    if (books.length === 0) {
        return res.status(404).json(new ApiResponse(404, 'No books found matching the query.', []));
    }

    res.status(200).json(new ApiResponse(200, 'Books found successfully', books)); 
});

const searchBooksByRent = asyncHandler(async (req, res) => {
    const { minRent, maxRent } = req.body; 

    
    if (!minRent || !maxRent) {
        throw new ApiError(400, 'Both minimum and maximum rent values are required.');
    }

    
    const min = parseFloat(minRent);
    const max = parseFloat(maxRent);

    
    if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
        throw new ApiError(400, 'Invalid rent range provided.');
    }

    const books = await book.find({
        rentPerDay: { $gte: min, $lte: max }
    });

    if (books.length === 0) {
        return res.status(404).json(new ApiResponse(404, 'No books found within the specified rent range.', [])); 
    }

    res.status(200).json(new ApiResponse(200, 'Books found successfully', books)); 
});


const searchBooksByCriteria = asyncHandler(async (req, res) => {
    const { category, query, minRent, maxRent } = req.body; 

    // Input validation
    if (!category || !minRent || !maxRent) {
        throw new ApiError(400, 'Category, minimum rent, and maximum rent values are required.');
    }

    // Parse the rent values to numbers
    const min = parseFloat(minRent);
    const max = parseFloat(maxRent);

    // Validate rent values
    if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
        throw new ApiError(400, 'Invalid rent range provided.');
    }

    const Book = await bookModel(); // Get the book model

    // Build the query object
    const queryObj = {
        category: category,
        rentPerDay: { $gte: min, $lte: max },
    };

    
    if (query) {
        queryObj.bookName = { $regex: query, $options: 'i' }; 
    }

    const books = await Book.find(queryObj); 

    if (books.length === 0) {
        return res.status(404).json(new ApiResponse(404, 'No books found matching the criteria.', [])); 
    }

    res.status(200).json(new ApiResponse(200, 'Books found successfully', books)); 
});


export {getAllBooks, createBook, searchBooks , searchBooksByRent , searchBooksByCriteria}
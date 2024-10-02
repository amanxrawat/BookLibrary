import { getAllBooks,createBook ,searchBooks,searchBooksByCriteria,searchBooksByRent } from "../controllers/book.controller.js";
import { Router } from "express";

const router = Router();

router.route('/allbooks').get(getAllBooks);
router.route('/createbook').post(createBook);
router.route('/searchBooks').post(searchBooks);
router.route('/searchByCriteria').post(searchBooksByCriteria);

// changed --check 
router.route('/searchByRent').post(searchBooksByRent);

export default router;
import { issueBook, returnBook , totalRentGenerated,
     getBookIssueDetails , getBooksIssuedInDateRange , getBooksIssuedToUser } from "../controllers/transaction.contorller.js";


import { Router } from "express";
const router = Router();

router.route("/issue").post(issueBook);
router.route("/return").post(returnBook);
router.route("/totalRent/:bookName").get(totalRentGenerated);
router.route("/bookIssuedetails/:bookName").get(getBookIssueDetails);
router.route("/booksIssued/withRange").post(getBooksIssuedInDateRange);

// in this route we are using querry for either username or the userId;
router.route("/bookIssuedToUser").get(getBooksIssuedToUser);

export default router;


import { Router } from "express";
import { createUser, getAllUser } from "../controllers/user.controller.js";

const router = Router();

router.route('/createUser').post(createUser);

router.route('/getAllUser').get(getAllUser);


export default router;
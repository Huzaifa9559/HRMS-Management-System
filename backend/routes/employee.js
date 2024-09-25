import express from 'express';
const router = express.Router();

//import that specific controllers
import { createAccount } from '../controllers/employeeController.js';


//creating routes
router.post('/create-account', createAccount);

export default router;
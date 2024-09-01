import express from 'express';
const router = express.Router();

//import that specific controllers
import userController from '../controllers/usercontroller.js';

//creating routes
router.post('/google-signin', userController.createUserThroughGoogle);
router.post('/signup', userController.createUser);


export default router;
import express from 'express';
import loginController from '../controllers/loginController.js'; 
import validatorLogin from '../middlewares/validators/login.js';

const router = express.Router();

router.post('/', validatorLogin, loginController);

export default router;
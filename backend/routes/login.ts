import express from 'express';
import loginController from '../controllers/loginController'; 
import validatorLogin from '../middlewares/validators/login';

const router = express.Router();

router.post('/', validatorLogin, loginController);

export default router;
import express, {RequestHandler } from 'express';
import loginController from '../controllers/loginController'; 
import validatorLogin from '../middlewares/validators/login';

const router = express.Router();

router.post('/', validatorLogin, loginController as RequestHandler);

export default router;
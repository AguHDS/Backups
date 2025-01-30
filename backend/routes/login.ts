import express, {RequestHandler } from 'express';
import loginController from '../controllers/loginController.ts'; 
import validatorLogin from '../middlewares/validators/login.ts';

const router = express.Router();

router.post('/', validatorLogin, loginController as RequestHandler);

export default router;
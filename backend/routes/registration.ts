import express from 'express';
import register from '../controllers/registrationController';
import validatorRegistration from '../middlewares/validators/registration';

const router = express.Router();

router.post('/', validatorRegistration, register);

export default router;
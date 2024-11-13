import express from 'express';
import logoutMiddleware from '../middlewares/logoutMiddleware.js'
import logoutController from '../controllers/logoutController.js'

const router = express.Router();

router.post('/', logoutMiddleware, logoutController);

export default router;
import express from 'express';
import { signUp, signIn, google } from '../controllers/auth_controller.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.post('/google', google);

export default authRouter;
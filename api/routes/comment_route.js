import express from 'express';
import { createComment } from '../controllers/comment_controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const commentRouter = express.Router();

commentRouter.get('/create', verifyToken, createComment);
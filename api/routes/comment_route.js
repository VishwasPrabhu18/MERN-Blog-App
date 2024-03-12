import express from 'express';
import { createComment, getPostComments, likeComment, editComment } from '../controllers/comment_controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const commentRouter = express.Router();

commentRouter.post('/create', verifyToken, createComment);
commentRouter.get('/getPostComments/:postId', getPostComments);
commentRouter.put("/likeComment/:commentId", verifyToken, likeComment);
commentRouter.put("/editComment/:commentId", verifyToken, editComment);

export default commentRouter;
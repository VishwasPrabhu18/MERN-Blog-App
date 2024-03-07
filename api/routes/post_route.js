import express from 'express';
import { verifyToken } from "../utils/verifyUser.js";
import { createPost, getPosts } from '../controllers/post_controller.js';

const postRouter = express.Router();

postRouter.post("/create", verifyToken, createPost);
postRouter.get("/getposts", getPosts);

export default postRouter;
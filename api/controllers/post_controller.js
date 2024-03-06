import Post from "../models/post_model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => { 
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to create a post"));
    }
    if(!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Title and Content are required"));
    }

    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "-");
    const post = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });

    try {
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};
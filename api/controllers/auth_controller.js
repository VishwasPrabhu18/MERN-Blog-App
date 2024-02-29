import bcryptjs from "bcryptjs";
import User from "../models/user_model.js";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password || userName === '' || email === '' || password === '') {
        next(errorHandler(400, 'Please fill in all fields'));
    }

    if (password.length < 6) {
        next(errorHandler(400, 'Password should be atleast 6 characters long'));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
        userName,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).json("user created successfully");
    } catch (error) {
        next(error);
    }
};
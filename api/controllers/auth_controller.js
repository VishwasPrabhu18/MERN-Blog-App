import bcryptjs from "bcryptjs";
import User from "../models/user_model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'Please fill in all fields'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid credentials'));
        }

        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);

        const { password: userPassword, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({ email });
        if(user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                userName: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });

            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }
};
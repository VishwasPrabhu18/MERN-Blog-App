import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user_model.js";

export const test = (req, res) => {
    res.json({ message: "Test Route" });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(401, "Unauthorized User"));
    }

    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters"));
        }

        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.userName) {
        if (req.body.userName.length < 5 || req.body.userName.length > 20) {
            return next(errorHandler(400, "Username must be between 5 and 20 characters"));
        }
        if (req.body.userName.includes(' ')) {
            return next(errorHandler(400, "Username cannot contain spaces"));
        }
        if (req.body.userName !== req.body.userName.toLowerCase()) {
            return next(errorHandler(400, "Username must be in lowercase"));
        }
        if (!req.body.userName.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "Username can only contain letters and numbers"));
        }
    }

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, { new: true });

        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => { 
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(401, "Unauthorized User"));
    }

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({ message: "User Deleted Successfully" });
    } catch (error) {
        next(error);
    }
};

export const signOut = (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json("User Signed Out");
    } catch (error) {
        next(error);
    }
};
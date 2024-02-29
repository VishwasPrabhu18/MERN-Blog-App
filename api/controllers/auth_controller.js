import bcryptjs from "bcryptjs";
import User from "../models/user_model.js";

export const signUp = async (req, res) => {
    const { userName, email, password } = req.body;

    if(!userName || !email || !password || userName === '' || email === '' || password === '') {
        return res.status(400).json({message: 'Please fill in all fields'});
    }

    if(password.length < 6) {
        return res.status(400).json({message: 'Password should be atleast 6 characters long'});
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
        res.status(409).json({message: error.message});
    }
};
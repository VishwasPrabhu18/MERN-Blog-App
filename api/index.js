import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user_route.js";
import authRouter from "./routes/auth_route.js";
import postRouter from "./routes/post_route.js";
import commentRouter from "./routes/comment_route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB Connected");
}).catch((err) => {
    console.log(err);
});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is Listening to the port : 3000");
});

app.use("/api/user", userRouter);

app.use("/api/auth", authRouter);

app.use("/api/post", postRouter);

app.use("/api/comment", commentRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
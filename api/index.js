import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user_route.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB Connected");
}).catch((err) => {
    console.log(err);
});

const app = express();

app.listen(3000, () => {
    console.log("Server is Listening to the port : 3000");
});

app.use("/api/user", userRouter);
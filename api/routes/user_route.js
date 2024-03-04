import express from "express";
import { test, updateUser } from "../controllers/user_controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.get("/test", test);

userRouter.put("/update/:userId", verifyToken, updateUser);

export default userRouter;
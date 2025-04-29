import { Router } from "express";
import { forgetPassword, login, logout, resetPassword, signup } from "./auth.controller.js";

const userRouter = Router()

userRouter.post('/register', signup)
userRouter.post('/login', login)
userRouter.post('/logout',logout)
userRouter.post('/forgetPassword',forgetPassword)
userRouter.post('/resetPassword/:token',resetPassword)

export default userRouter
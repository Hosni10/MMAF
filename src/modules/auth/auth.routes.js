import { Router } from "express";
import { forgetPassword, login, logout, resetPassword, signup,getSingleUser, UpdateUser, addUser, getAllUser, deleteUser, getAllLength } from "./auth.controller.js";
import { multerCloudFunction } from "../../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";

const userRouter = Router()

userRouter.post('/register', signup)
userRouter.post('/login', login)
userRouter.post('/logout',logout)
userRouter.post('/forgetPassword',forgetPassword)
userRouter.post('/resetPassword/:token',resetPassword)
userRouter.get('/getUser/:id',getSingleUser)
userRouter.post('/addUser',addUser)


userRouter.put('/update/:id',multerCloudFunction(allowedExtensions.Image).single('image'),UpdateUser)

userRouter.get('/getAll',getAllUser)
userRouter.delete('/:id',deleteUser)

userRouter.get('/getDashboard',getAllLength)


userRouter.post("/forget-Password",forgetPassword)
userRouter.post('/reset-password',resetPassword)

export default userRouter
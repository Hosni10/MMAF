import { Router } from "express";
import { forgetPassword, login, logout, resetPassword, signup, getSingleUser, UpdateUser, addUser, getAllUser, deleteUser, getAllLength, verifyUserToken } from "./auth.controller.js";
import { multerCloudFunction } from "../../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";
import { addUsersEndpoints } from "./authEndpoints.js";
import { isAuth } from "../../middleware/isAuth.js";

const userRouter = Router()

userRouter.post('/register', signup)
userRouter.post('/login', login)
userRouter.post('/logout', logout)
userRouter.post('/forgetPassword', forgetPassword)
userRouter.post('/resetPassword/:token', resetPassword)
userRouter.get('/getUser/:id', getSingleUser)
userRouter.post('/addUser', isAuth(addUsersEndpoints.ADD_USER), addUser)

userRouter.put('/update/:id', isAuth(addUsersEndpoints.UPDATE_USER), multerCloudFunction(allowedExtensions.Image).single('image'), UpdateUser)

userRouter.get('/getAll', getAllUser)
userRouter.delete('/:id',isAuth(addUsersEndpoints.DELETE_USER), deleteUser)

userRouter.get('/getDashboard', getAllLength)

userRouter.post("/forget-Password", forgetPassword)
userRouter.post('/reset-password', resetPassword)

userRouter.get('/verify', verifyUserToken)

export default userRouter
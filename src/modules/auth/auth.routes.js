import { Router } from "express";
import { forgetPassword, login, logout, resetPassword, signup, getSingleUser, UpdateUser, addUser, getAllUser, deleteUser, getAllLength, verifyUserToken, updateProfile } from "./auth.controller.js";
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

userRouter.put('/updateProfile/:id', multerCloudFunction(allowedExtensions.Image).single('image'), updateProfile)

userRouter.get('/getAll', getAllUser)

userRouter.get('/getDashboard', getAllLength)

userRouter.post("/forget-Password", forgetPassword)
userRouter.post('/reset-password', resetPassword)

userRouter.get('/verify', verifyUserToken)



// ! Authorized
userRouter.post('/addUser', isAuth(addUsersEndpoints.ADD_USER) ,multerCloudFunction(allowedExtensions.Image).single('image'), addUser)
userRouter.put('/update/:id', isAuth(addUsersEndpoints.UPDATE_USER), multerCloudFunction(allowedExtensions.Image).single('image'), UpdateUser)
userRouter.delete('/:id',isAuth(addUsersEndpoints.DELETE_USER), deleteUser)
export default userRouter
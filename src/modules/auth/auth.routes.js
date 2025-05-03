import { Router } from "express";
import { forgetPassword, login, logout, resetPassword, signup,getSingleUser, UpdateUser } from "./auth.controller.js";

const userRouter = Router()

userRouter.post('/register', signup)
userRouter.post('/login', login)
userRouter.post('/logout',logout)
userRouter.post('/forgetPassword',forgetPassword)
userRouter.post('/resetPassword/:token',resetPassword)
userRouter.post('/getUser/:id',getSingleUser)
userRouter.put('/update/:id',UpdateUser)

export default userRouter


let age = 18;

if (age >= 18 && age < 65) {
  console.log("Adult");
} else {
  console.log("Not an adult");
}










  



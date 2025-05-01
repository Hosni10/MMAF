
// import {sendEmailService} from "../../services/sendEmail.js"
// import { userModel } from "../../../Database/models/user.model.js"
// import { emailTemplate } from "../../utilities/emailTemplate.js"
import {generateToken, verifyToken} from "../../utilities/tokenFunctions.js"
import { nanoid } from "nanoid"
import pkg from 'bcrypt'
import { userModel } from "../../../db/models/user.model.js"
import catchError from "../../middleware/ErrorHandeling.js"
import CustomError from "../../utilities/customError.js"
import jwt from "jsonwebtoken"

export const signup = async(req,res,next) => {
    
    const { 
        userName,
        email,
        password,
        phoneNumber,
        role
    } = req.body
    //is email exsisted
    const isExsisted = await userModel.findOne({email})
    if(isExsisted){
        return res.status(400).json({message:"Email exsisted"})
    }

    const hashedPassword = pkg.hashSync(password, +process.env.SALT_ROUNDS)
    
    const user = new userModel({
        userName,
        email,
        password:hashedPassword,
        phoneNumber,
        role
    })
    const saveUser = await user.save()
    res.status(201).json({message:'done', saveUser})
}

// export const confirmEmail = async(req,res,next) => {
//     const {token} = req.params

//     const decode = verifyToken({
//         token,
//         signature: process.env.CONFIRMATION_EMAIL_TOKEN, // ! process.env.CONFIRMATION_EMAIL_TOKEN
//     })
//     const user = await userModel.findOneAndUpdate(
//         {email: decode?.email, isConfirmed:false},
//         {isConfirmed: true},
//         {new:true},
//         )
        
//         if(!user){
//             return res.status(400).json({message:'already confirmed'})
//         }


//         return res.status(200).json({message:'confirmed done, now log in'})

// }


export const login = catchError(async(req,res,next) => {
    const {email,password} = req.body
console.log(req.body);

     
    if(!email || !password){
        return next(new CustomError('Email And Password Is Required',  422 ))
     }

    const userExsist = await userModel.findOne({email})
    if(!userExsist){
        return next(new CustomError('user not found',404))
    } 

    // if(userExsist.isConfirmed == false){
    //   return next(new CustomError('please confirm your email first',404))
    // }
    // console.log(password);
    
    const passwordExsist = pkg.compareSync(password,userExsist.password)
    // console.log(passwordExsist);
    // console.log(userExsist.password);
    
    if(!passwordExsist){
        return next(new CustomError('password incorrect',404))
    }

    const token = generateToken({
        payload:{
            email,
            _id: userExsist._id,
            role: userExsist.role
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET || "Login", // ! process.env.SIGN_IN_TOKEN_SECRET
        expiresIn: '1d',
     })
     

     const userUpdated = await userModel.findOneAndUpdate(
        
        {email},
        
        {
            token,
            isActive: true,
        },
        {new: true},
     )
     res.status(200).json({message: 'Login Success', userUpdated})
})

export const logout = async (req, res, next) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.SIGN_IN_TOKEN_SECRET || "Login");
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          // إذا انتهت صلاحية التوكن، نقوم فقط بفك تشفيره بدون التحقق منه
          decoded = jwt.decode(token);
        } else {
            console.log(error);
            
          return res.status(401).json({ message: "Invalid token" });
        }
      }
  
      if (!decoded || !decoded.email) {
        return res.status(401).json({ message: "Invalid token" });
      }
  
      const email = decoded.email;
  
      // console.log("Decoded email:", email);
  
      // البحث عن المستخدم
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // تحديث حالة المستخدم إلى "offline" حتى لو كان التوكن منتهي الصلاحية
      await userModel.findOneAndUpdate(
        { email },
        { token: null, isActive:false },
        { new: true }
      );
  
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const forgetPassword = async(req,res,next) => {
    const {email} = req.body

    const isExist = await userModel.findOne({email})
    if(!isExist){
        return res.status(400).json({message: "Email not found"})
    }

    const code = nanoid()
    const hashcode = pkg.hashSync(code, +process.env.SALT_ROUNDS) // ! process.env.SALT_ROUNDS
    const token = generateToken({
        payload:{
            email,
            sendCode:hashcode,
        },
        signature: process.env.RESET_TOKEN, // ! process.env.RESET_TOKEN
        expiresIn: '1h',
    })
    const resetPasswordLink = `https://roomo.ai/reset-password.html?token=${token}`
    console.log(resetPasswordLink);
    
    const isEmailSent = sendEmailService({
        to:email,
        subject: "Reset Password",
        message: emailTemplate({
            link:resetPasswordLink,
            linkData:"Click Here Reset Password",
            subject: "Reset Password",
        }),
    })    
    if(!isEmailSent){
        return res.status(400).json({message:"Email not found"})
    }

    const userupdete = await userModel.findOneAndUpdate(
        {email},
        {forgetCode:hashcode},
        {new: true},
    )
    return res.status(200).json({message:"password changed",userupdete})
}

export const resetPassword = async(req,res,next) => {
    const {token} = req.params
    const decoded = verifyToken({token, signature: process.env.RESET_TOKEN}) // ! process.env.RESET_TOKEN
    const user = await userModel.findOne({
        email: decoded?.email,
        fotgetCode: decoded?.sentCode
    })

    if(!user){
        return res.status(400).json({message: "you are alreade reset it , try to login"})
    }
    
    const {newPassword} = req.body
    // console.log(newPassword);
    
    const hashedPassword = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)

    user.password = hashedPassword,
    user.forgetCode = null

    const updatedUser = await user.save()

    res.redirect(302, 'http://roomo.ai/success-password-reset.html');

    // res.status(200).json({message: "Done",updatedUser})

}

export const getAllUser = async(req,res,next) => {
    const users = await userModel.find().populate(`paymentHistory`)
    // TODO users.paymentHistory.planId
    res.status(201).json({message:"Users",users})
}


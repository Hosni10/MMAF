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
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js"
import { membersModel } from "../../../db/models/members.model.js"
import { newsModel } from "../../../db/models/news.model.js"
import { tempVerificationModel } from "../../../db/models/OTP_CODE.js"
import { sendVerificationEmail } from "../../../services/sendEmail.js"
import crypto from 'crypto';

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


export const login = catchError(async(req,res,next) => {
    const {email,password} = req.body
 
     
    if(!email || !password){
        return next(new CustomError('Email And Password Is Required',  422 ))
     }

    const userExsist = await userModel.findOne({email})
    if(!userExsist){
        return next(new CustomError('user not found',401))
    } 

    if(userExsist.isActive == false){
        return next(new CustomError('user is not active',401))
    }

    
    const passwordExsist = pkg.compareSync(password,userExsist.password)
 
    if(!passwordExsist){
        return next(new CustomError('password incorrect',401))
    }

    const token = generateToken({
        payload:{
            email,
            _id: userExsist._id,
            role: userExsist.role
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET || "Login", // ! process.env.SIGN_IN_TOKEN_SECRET
        expiresIn: '1m',
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

// export const forgetPassword = async(req,res,next) => {
//     const {email} = req.body

//     const isExist = await userModel.findOne({email})
//     if(!isExist){
//         return res.status(400).json({message: "Email not found"})
//     }

//     const code = nanoid()
//     const hashcode = pkg.hashSync(code, +process.env.SALT_ROUNDS) // ! process.env.SALT_ROUNDS
//     const token = generateToken({
//         payload:{
//             email,
//             sendCode:hashcode,
//         },
//         signature: process.env.RESET_TOKEN, // ! process.env.RESET_TOKEN
//         expiresIn: '1h',
//     })
//     const resetPasswordLink = `https://roomo.ai/reset-password.html?token=${token}`
//     console.log(resetPasswordLink);
    
//     const isEmailSent = sendEmailService({
//         to:email,
//         subject: "Reset Password",
//         message: emailTemplate({
//             link:resetPasswordLink,
//             linkData:"Click Here Reset Password",
//             subject: "Reset Password",
//         }),
//     })    
//     if(!isEmailSent){
//         return res.status(400).json({message:"Email not found"})
//     }

//     const userupdete = await userModel.findOneAndUpdate(
//         {email},
//         {forgetCode:hashcode},
//         {new: true},
//     )
//     return res.status(200).json({message:"password changed",userupdete})
// }

// export const resetPassword = async(req,res,next) => {
//     const {token} = req.params
//     const decoded = verifyToken({token, signature: process.env.RESET_TOKEN}) // ! process.env.RESET_TOKEN
//     const user = await userModel.findOne({
//         email: decoded?.email,
//         fotgetCode: decoded?.sentCode
//     })

//     if(!user){
//         return res.status(400).json({message: "you are alreade reset it , try to login"})
//     }
    
//     const {newPassword} = req.body
//     // console.log(newPassword);
    
//     const hashedPassword = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)

//     user.password = hashedPassword,
//     user.forgetCode = null

//     const updatedUser = await user.save()


//     res.status(200).json({message: "Done",updatedUser})

// }

export const getAllUser = async(req,res,next) => {
    const users = await userModel.find()
    res.status(201).json({message:"Users",users})
}

export const getSingleUser = async(req,res,next) => {
    const {id} = req.params
    const user = await userModel.findById(id)
    res.status(201).json({message:"User",user})
}

export const addUser = catchError(async(req,res,next) => {
    const {userName,email,password,phoneNumber,role} = req.body
    console.log(req.authUser);
    
    console.log(req.body);
    
    const isExist = await userModel.findOne({email})
    if(isExist){
        return next(new CustomError('Email is Already exsisted',  400 ))
    }

    const hashedPassword = pkg.hashSync(password, +process.env.SALT_ROUNDS)
    const user = new userModel({
        userName,
        email,
        password:hashedPassword,
        phoneNumber,
        role
    })

   const userData =  user.save()

   res.status(201).json({message:"User",userData})

})


export const UpdateUser = async(req,res,next) => {
    const {userName,phoneNumber,email,password,
        role,
        isActive,} = req.body
    // console.log(req.body);
    // console.log(req.file);
    console.log(req.authUser);
    
    const {id} = req.params
    const user = await userModel.findById(id)

    console.log(user);
    

    if(!user) {
        return next(new Error("user Didn't Found",{cause:400}))
      }
        // Check if file is uploaded
        if (req.file) {
            // Upload image to ImageKit
            const uploadResult = await imagekit.upload({
              file: req.file.buffer,
              fileName: req.file.originalname,
              folder: `${process.env.PROJECT_FOLDER || 'MMAF'}/User/${user.customId}`,
            });
            user.image.secure_url = uploadResult.url
            user.image.public_id = uploadResult.fileId
          }
          
          if(userName) user.userName = userName
          if(phoneNumber) user.phoneNumber = phoneNumber
          if(email) user.email = email
          if(role) user.role = role
          if(isActive) user.isActive = isActive

          if(password) {
            const hashedPassword = pkg.hashSync(password, +process.env.SALT_ROUNDS)
            user.password = hashedPassword
          }

          // save the user 
          await user.save()
          res.status(200).json({message : "user updated successfully",user})      
}

export const updateProfile = async (req,res,next) => {
   const {userName,phoneNumber,email,password} = req.body

    const {id} = req.params
    const user = await userModel.findById(id)    

    if(!user) {
        return next(new Error("user Didn't Found",{cause:400}))
      }
        // Check if file is uploaded
        if (req.file) {
            // Upload image to ImageKit
            const uploadResult = await imagekit.upload({
              file: req.file.buffer,
              fileName: req.file.originalname,
              folder: `${process.env.PROJECT_FOLDER || 'MMAF'}/User/${user.customId}`,
            });
            user.image.secure_url = uploadResult.url
            user.image.public_id = uploadResult.fileId
          }
          
          if(userName) user.userName = userName
          if(phoneNumber) user.phoneNumber = phoneNumber
          if(email) user.email = email

          if(password) {
            const hashedPassword = pkg.hashSync(password, +process.env.SALT_ROUNDS)
            user.password = hashedPassword
          }

          // save the user 
          await user.save()
          res.status(200).json({message : "user updated successfully",user})      
}

export const deleteUser = async(req,res,next) => {
    const {id} = req.params
    
    const user = await userModel.findById(id)
  if (user) {
    const uploadedimage = user.image.public_id
    if(uploadedimage){
        await destroyImage(uploadedimage)
    }
  }
  await userModel.findByIdAndDelete(id)
    res.status(201).json({message:"User",user})
}



export const getAllLength = async(req,res,next) => {
    const members = (await membersModel.find()).length
    const news = (await newsModel.find()).length
    const users = (await userModel.find({isActive:true})).length


    res.status(201).json({message:"dashboard",members,news,users})

}




export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    const verificationCode = crypto.randomInt(100000, 999999);
    // console.log(verificationCode);
    
    // First check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
        return next(new Error('Email not registered'));
    }
    // console.log(existingUser);
    
    existingUser.verificationCode = verificationCode;
    await existingUser.save();
    // Store verification code in database
    await tempVerificationModel.create({
        email,
        code: verificationCode,
        // expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
  
    await sendVerificationEmail(email, verificationCode);
    res.status(200).json({ message: 'Verification code sent successfully' });
  };


  export const resetPassword = async(req,res,next) => {
    const {verificationCode, newPassword, email} = req.body;
    
    const user = await userModel.findOne({email});
    if(!user) {
        return res.status(400).json({message: "User not found"});
    }
  
    if (!user.verificationCode || user.verificationCode !== parseInt(verificationCode)) {
        return res.status(400).json({ error: 'Invalid verification code' });
    }
  
    // if (user.codeExpiresAt < Date.now()) {
    //     return res.status(400).json({ error: 'Verification code expired' });
    // }

    const hashedPassword = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)
    user.password = hashedPassword;
    user.verificationCode = null;
    user.codeExpiresAt = null;
  
    const updatedUser = await user.save();
    res.status(200).json({message: "Password reset successfully", updatedUser});
  };

export const verifyUserToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new CustomError('Please login first', 400));
    }

    const token = authorization.split(' ')[1];
    
      const decodedData = verifyToken({
        token,
        signature: process.env.SIGN_IN_TOKEN_SECRET || "Login",
      });

      const user = await userModel.findById(decodedData._id);
      
      if (!user) {
        return next(new CustomError('User not found', 404));
      }


      res.status(200).json({ user: userData });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new CustomError('Token expired', 401));
      }
      return next(new CustomError('Invalid token', 401));
    }
};

  
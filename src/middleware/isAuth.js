import { userModel } from '../../db/models/user.model.js';
import CustomError from '../utilities/customError.js';
import { generateToken, verifyToken } from '../utilities/tokenFunctions.js';

export const isAuth =  (roles) => {
  return async (req, res, next) => {
    try {
      
      const { authorization } = req.headers
      if (!authorization) {
        return next(new CustomError('Please login first',  400 ))
      }

      if (!authorization.startsWith('MMA')) {
        return next(new CustomError('invalid token prefix', { cause: 400 }))
      }
      
      const splitedToken = authorization.split(' ')[1]
      
      try {
        const decodedData = verifyToken({
          token: splitedToken,
          signature: process.env.SIGN_IN_TOKEN_SECRET,
        })
        // console.log("decodedData: ",decodedData);
        // console.log("decodedData: ",decodedData._id);
         
        const findUser = await userModel.findById(
          decodedData._id,
          'email userName role',
        )
            
        
        if (!findUser) {
          return next(new CustomError('Please SignUp',  400 ))
        }
        // console.log(roles);
        // console.log(findUser.role);
        // ~ Authorization error
        if(!roles.includes(findUser.role)){          
          // return res.status(400).json({message:'UnAuthorized to access this api'})
          return next(new CustomError('UnAuthorized to access this api',  400 ))

        }
        req.authUser = findUser
        next()
      } catch (error) {
        // token  => search in db
        if (error == 'TokenExpiredError: jwt expired') {
          // refresh token
          const user = await userModel.findOne({ token: splitedToken })
          if (!user) {            
            return next(new CustomError('Wrong Token - Token not found in user data',  400 ))
          } 
          // generate new token
          const userToken = generateToken({
            payload: {
              email: user.email,
              _id: user._id,
            },
            signature: process.env.SIGN_IN_TOKEN_SECRET, // ! process.env.SIGN_IN_TOKEN_SECRET
            expiresIn: '1h',
          })

          if (!userToken) {
            return next(new CustomError('token generation fail, payload canot be empty',  400 ))
          }

          // user.token = userToken
          // await user.save()
          await userModel.findOneAndUpdate(
            { token: splitedToken },
            { token: userToken },
            {new: true},
          )
          return res.status(401).json({ message: 'Token refreshed', userToken })
        }
        return next(new CustomError('invalid token',  500 ))
      }
    } catch (error) {
      console.log(error)
      next(new CustomError('catch error in auth',  500 ))
    }
  }
}
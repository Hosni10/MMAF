import CustomError from '../utilities/customError.js'



export default function catchError(callBack) {
    return (req, res, next) => {
        callBack(req, res, next).catch(err => {
            // If err is already a CustomError, pass it through
            if (err instanceof CustomError) {
                return next(err);
            }
            // Otherwise create new CustomError
            next(new CustomError(err.message || err, 400));
        });
    };
}



export const globalResponse = (err, req, res, next) => {
    if (err) {
    //   console.log(req.validationErrors)
    //   console.log("globalResponse");
      
      if (req.validationErrors) {
        return res
          .status(err['cause'] || 500)
          .json({ error: req.validationErrors })
      }
      return res.status(err['cause'] || 500).json({ message: err.message })
    }
  }
  
  
//   export const globalResponse = (err, req, res, next) => {
//     if (err) {
//         const statusCode = err.statusCode || err.cause || 500;
        
//         if (req.validationErrors) {
//             return res.status(statusCode).json({ error: req.validationErrors });
//         }
        
//         return res.status(statusCode).json({ message: err.message });
//     }
// };

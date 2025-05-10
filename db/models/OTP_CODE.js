import { model, Schema } from "mongoose"
import { type } from "os"

const tempVerificationSchema = new Schema({
    email:{
        type:String,
        // required:true,
    },
    code:{
        type:Number,
        // required:true,
    },
    codeExpiresAt: {
        type: Date,
    }

},{timestamps:true})

export const tempVerificationModel = model('tempVerification', tempVerificationSchema)
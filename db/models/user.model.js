import { model, Schema } from "mongoose";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        enum:['admin', 'user'],
        default: 'user',
        required: true
    },
    image: {
        secure_url: {
            type: String,
            // required: true
        },
        public_id:{
            type: String,
            // required: true
        }
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    isDeleted: {
        type: Boolean,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default: null
    }
},{timeseries: true});

export const userModel = model("user", userSchema);
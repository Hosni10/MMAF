import { time } from "console";
import mongoose from "mongoose";


const membersSchema = new mongoose.Schema({
    name: {
        ar: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        }
    },
    image: {
        secure_url: {
            type: String,
            // required: true
        },
        public_id: {
            type: String,
            // required: true
        }
    },
    position: {
        ar: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        }
    },
    // description: {
    //     ar: {
    //         type: String,
    //         required: true
    //     },
    //     en: {
    //         type: String,
    //         required: true
    //     }
    // }
},{timestamps: true});

export const membersModel = mongoose.model("members", membersSchema);
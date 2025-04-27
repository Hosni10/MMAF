import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: {
        ar:{
        type: String,
        required: true
    },
    en:{
        type: String,
        required: true
    }},
    content: {
        ar:{
            type: String,
            required: true
        },
        en:{
            type: String,
            required: true
        },
    },
    image: {
        secure_url: {
            type: String,
            required: true
        },
        public_id:{
            type: String,
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    customId: {
        type: String,
        required: true
    }
})

export const newsModel = mongoose.model('news', newsSchema)
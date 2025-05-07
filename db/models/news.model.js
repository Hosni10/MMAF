import { model, Schema } from "mongoose";

const newsSchema = new Schema({
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
    image: [
        {
          secure_url: {
            type: String,
            // required: true,
          },
          public_id: {
            type: String,
            // required: true,
          },
        },
      ],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required:true    
    },
    date: {
        type: Date,
        default: Date.now
    },
    customId: {
        type: String,
    }
})

export const newsModel = model('news', newsSchema)
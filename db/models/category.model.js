import { model, Schema } from "mongoose";

const categorySchema = new Schema({
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
});


export const categoryModel = model("category", categorySchema);
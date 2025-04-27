import mongoose from "mongoose";

export const db = mongoose.connect("mongodb://localhost:27017/mmaf")
.then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.error('Error connecting to database:',(err))
})
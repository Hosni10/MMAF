import mongoose from "mongoose";

export const db = mongoose
  .connect(
    "mongodb+srv://uaemmf:XgDCYudREXuowqxu@cluster0.jqslqsm.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

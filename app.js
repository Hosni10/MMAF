import express from "express";
import { db } from "./db/dbConnection.js";
import newsRouter from "./src/modules/news/news.routes.js";
import userRouter from "./src/modules/auth/auth.routes.js";
const app = express();
const port = 6060;
app.use(express.json());
db;
app.use("/news", newsRouter);
app.use("/auth", userRouter);


app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

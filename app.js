import express from "express";
import { db } from "./db/dbConnection.js";
import newsRouter from "./src/modules/news/news.routes.js";
import userRouter from "./src/modules/auth/auth.routes.js";
import contactUsRouter from "./src/modules/contactUs/contactUs.routes.js";
import cors from 'cors'
import morgan from "morgan";
import memberRouter from "./src/modules/members/member.routes.js";
import { config } from 'dotenv'
import path from 'path'
config({path: path.resolve('./config/.env')})
import color from "@colors/colors"

const app = express();
const port = process.env.PORT

app.use(cors());

app.use(morgan('dev'));

// 'combined' - Standard Apache combined log output
// 'common' - Standard Apache common log output
// 'dev' - Colored by response status for development
// 'short' - Shorter than default, includes response time
// 'tiny' - Minimal output

app.use(express.json());
db;
app.use("/news", newsRouter);
app.use("/auth", userRouter);
app.use("/contact", contactUsRouter);
app.use("/members", memberRouter);


app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`.blue)); 
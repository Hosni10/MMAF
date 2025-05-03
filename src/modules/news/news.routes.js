import express from "express";
import { addNews, deleteNews, getNews, getNewsById, updateNews } from "./news.controller.js";
import { multerCloudFunction } from "../../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";


const newsRouter = express.Router()

newsRouter.get('/getallnews', getNews)
newsRouter.post('/addNews',multerCloudFunction(allowedExtensions.Image).single('image'),addNews)

newsRouter.put('/:id', multerCloudFunction(allowedExtensions.Image).single('image'), updateNews)

newsRouter.get('/getnewsbyid/:id', getNewsById)
newsRouter.delete('/:id',deleteNews )

export default newsRouter


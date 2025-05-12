import express from "express";
import { addNews, deleteNews, getNews, getNewsById, getTenNews, updateNews } from "./news.controller.js";
import { multerCloudFunction } from "../../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";


const newsRouter = express.Router()

newsRouter.get('/getallnews', getNews)
newsRouter.post('/addNews', multerCloudFunction(allowedExtensions.Image).array("image", 3),addNews)

newsRouter.put('/:id',multerCloudFunction(allowedExtensions.Image).array("image", 3), updateNews)

newsRouter.get('/getnewsbyid/:id', getNewsById)
newsRouter.delete('/:id',deleteNews )
newsRouter.get('/getLastTenNews', getTenNews)

export default newsRouter


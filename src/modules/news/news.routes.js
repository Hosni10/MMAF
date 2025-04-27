import express from "express";
import { addNews, deleteNews, getNews, getNewsById, updateNews } from "./news.controller.js";


const newsRouter = express.Router()

newsRouter.get('/getallnews', getNews)
newsRouter.post('/addnews',addNews)
newsRouter.get('/getnewsbyid/:id', getNewsById)
newsRouter.put('/:id', updateNews)
newsRouter.delete('/:id',deleteNews )

export default newsRouter
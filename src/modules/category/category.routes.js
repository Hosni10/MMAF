import { Router } from "express";
import * as categoryCon from "./category.controller.js";
const categoryRouter = Router()

categoryRouter.get('/getAll',categoryCon.getAllCategory)
categoryRouter.get('/getSingle/:id',categoryCon.getSingleCategory)
categoryRouter.post('/add',categoryCon.addCategory)


export default categoryRouter
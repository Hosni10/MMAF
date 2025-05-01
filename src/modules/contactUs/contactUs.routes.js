import { Router } from "express";
import submitContactUsForm from "./contactUs.controller.js";

const contactUsRouter = Router()

contactUsRouter.post('/', submitContactUsForm)


export default contactUsRouter
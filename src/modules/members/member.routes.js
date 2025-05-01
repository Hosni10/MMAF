import express from "express";
import { addMember, deleteMember, getMemberById, getMembers, updateMember } from "./member.controller.js";
import { multerCloudFunction } from "../../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";

const memberRouter = express.Router()

memberRouter.get('/getallmembers', getMembers)
memberRouter.post('/addmember', multerCloudFunction(allowedExtensions.Image).single('image'),addMember)
memberRouter.put('/:id', multerCloudFunction(allowedExtensions.Image).single('image'),updateMember)
memberRouter.get('/getmemberbyid/:id', getMemberById)
memberRouter.delete('/:id', deleteMember )

export default memberRouter
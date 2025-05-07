import { categoryModel } from "../../../db/models/category.model.js"

export const getAllCategory = async(req,res,next) => {
    const category = await categoryModel.find()
    res.status(200).json({message:'done',category})
}

export const getSingleCategory = async(req,res,next) => {
    const {id} = req.params
    const category = await categoryModel.findById(id)
    res.status(200).json({message:'done',category})
}

export const addCategory = async(req,res,next) => {
    const {name} = req.body
    const category = new categoryModel({
        name
    })
    const saveCategory = await category.save()
    res.status(201).json({message:'done',saveCategory})
}
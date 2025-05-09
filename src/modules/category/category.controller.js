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

export const addCategory = async (req, res, next) => {
    try {
        const { name } = req.body; 

        // Validate that both fields exist
        if (!name?.ar || !name?.en) {
            return res.status(400).json({ message: "Both Arabic and English names are required." });
        }

        const category = new categoryModel({ name });

        const savedCategory = await category.save();

        res.status(201).json({ message: "Category added successfully.", category: savedCategory });
    } catch (error) {
        next(error); // pass to error handling middleware
    }
};
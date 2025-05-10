import { newsModel } from "../../../db/models/news.model.js";
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js";

import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

export const addNews = async (req, res, next) => {
    console.log(req.body);
    console.log(req.files.map(file => file.fieldname));
    const { 
      title_ar, title_en, 
      content_ar, content_en ,category,
    } = req.body;

    
    // Validate required fields
    if (!title_ar || !title_en || !content_ar || !content_en) {
      return res.status(400).json({ 
        message: "All title and content fields are required in both languages" 
      });
    }
    
    // Check if file is uploaded
    if (!req.files || req.files.length === 0) {
      return next(new Error("Please upload at least one image for the unit", { cause: 400 }));
    }
    
    // Generate a custom ID for the folder structure
    const customId = nanoid();
    console.log(customId);
    
    const uploadedImages = [];
    
    // Upload image to ImageKit
    for (const file of req.files) {
      const uploadResult = await imagekit.upload({
        file: file.buffer, 
        fileName: file.originalname,
        folder: `${process.env.PROJECT_FOLDER}/news/${customId}`,
      });

      uploadedImages.push({
        secure_url: uploadResult.url,
        public_id: uploadResult.fileId,
      });
    }
    
    // Create news object with multilingual data and image
    const newsObject = {
      title: {
        ar: title_ar,
        en: title_en
      },
      content: {
        ar: content_ar,
        en: content_en
      },
      image: uploadedImages,
      category,
      customId
    };
    
    // Save to database
    const news = await newsModel.create(newsObject);
    console.log(news);
    
    // If news creation fails, delete the uploaded image
    if (!news) {
      await destroyImage(uploadResult.fileId);
      return res.status(500).json({ message: "Failed to create news" });
    }
    
    res.status(201).json({ message: "News added successfully", news });
};

export const getNews = async (req, res, next) => {
  try {

    const news = await newsModel.find().sort({ date: -1 }).populate({
      path: 'category',
      select: 'name.ar name.en' // Add whatever fields you need from the category model
    });;
    res.status(200).json({ message: "News fetched successfully", news });
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};


export const deleteNews = async (req, res, next) => {
  try {
    const news = await newsModel.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    
    // Delete the image from ImageKit
    if (news.image && news.image.public_id) {
      await destroyImage(news.image.public_id);
    }
    
    // Delete the news from database
    const deletedNews = await newsModel.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "News deleted successfully", news: deletedNews });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news", error: error.message });
  }
};

export const updateNews = async (req, res, next) => {
  try {
    const { title_ar, title_en, content_ar, content_en ,category} = req.body;
    const id = req.params.id;
    console.log(req.body);
    
    // Find the news by ID
    const news = await newsModel.findById(id);
    
    // Check if news exists
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    
    // Update fields if provided
    if (title_ar) news.title.ar = title_ar;
    if (title_en) news.title.en = title_en;
    if (content_ar) news.content.ar = content_ar;
    if (content_en) news.content.en = content_en;
    
    
    // Handle image update if a new file is provided
    if (req.file) {
      // Delete the old image
      await destroyImage(news.image.public_id);
      
      // Upload the new image
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: `${process.env.PROJECT_FOLDER || 'MMAF'}/News/${news.customId || nanoid()}`,
      });
      
      // Update image fields
      news.image.secure_url = uploadResult.url;
      news.image.public_id = uploadResult.fileId;
    }
    
    // Save the updated news
    await news.save();
    
    res.status(200).json({ message: "News updated successfully", news });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ message: `Failed to update news: ${error.message}` });
  }
};




export const getNewsById = async (req, res, next) => {
  try {
    const news = await newsModel.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News fetched successfully", news });
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
}   




export const getTenNews = async (req, res, next) => {
  try {
    const news = await newsModel.find().sort({ date: -1 }).limit(10);
    res.status(200).json({ message: "News fetched successfully", news });
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};
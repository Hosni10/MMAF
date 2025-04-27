import { newsModel } from "../../../db/models/news.model.js";

export const addNews = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const news = await newsModel.create({ title, content });
    res.status(200).json({ message: "News added successfully", news });
  } catch (error) {
    res.status(500).json({ message: "Error adding news", error });
  }
};

export const getNews = async (req, res, next) => {
  try {
    const news = await newsModel.find();
    res.status(200).json({ message: "News fetched successfully", news });
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};


export const deleteNews = async (req, res, next) => {
  try {
    const news = await newsModel.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News deleted successfully", news });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news", error });
  }
}

export const updateNews = async (req, res, next) => {
  try {
    const news = await newsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News updated successfully", news });
  } catch (error) {
    res.status(500).json({ message: "Error updating news", error });
  }
}


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




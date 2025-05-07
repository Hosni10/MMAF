import { membersModel } from "../../../db/models/members.model.js";
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js";
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

const addMember = async (req, res, next) => {
  try {

    console.log(req.body);
    
    const name_ar = req.body.name.ar;
    const name_en = req.body.name.en;
    const position_ar = req.body.position.ar;
    const position_en = req.body.position.en;
    
    if (!name_ar || !name_en || !position_ar || !position_en) {
      return res.status(400).json({
        message: "All name and position fields are required in both languages",
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload member image" });
    }

    // Generate a custom ID for the folder structure
    const customId = nanoid();

    // Upload image to ImageKit
    const uploadResult = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: `${process.env.PROJECT_FOLDER || "MMAF"}/Members/${customId}`,
    });

    const member = new membersModel({
      name: { ar: name_ar, en: name_en },
      position: { ar: position_ar, en: position_en },
      image: {
        secure_url: uploadResult.url,
        public_id: uploadResult.fileId,
      }, 
      customId,
    });
    await member.save();

    res.status(200).json({ message: "Member added successfully" , member });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error });
  }
}

const getMembers = async (req, res, next) => {
  try {
    const members = await membersModel.find();
    res.status(200).json({ members });
  } catch (error) {
    res.status(500).json({ message: "Error fetching members", error });
  }
};

const getMemberById = async (req, res, next) => {
  try {
    const member = await membersModel.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member fetched successfully", member });
  } catch (error) {
    res.status(500).json({ message: "Error fetching member", error });
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const member = await membersModel.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Delete the image from ImageKit
    if (member.image && member.image.public_id) {
      await destroyImage(member.image.public_id);
    }

    // Delete the member from database
    const deletedMember = await membersModel.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Member deleted successfully", member: deletedMember });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting member", error: error.message });
  }
};

const updateMember = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    console.log(req.body);
    
    // Extract data from the nested structure
    const { name, position } = req.body;
    
    // Find the member by ID
    const member = await membersModel.findById(id);
    
    // Check if member exists
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    // Update fields if provided
    if (name) {
      if (name.ar) member.name.ar = name.ar;
      if (name.en) member.name.en = name.en;
    }
    
    if (position) {
      if (position.ar) member.position.ar = position.ar;
      if (position.en) member.position.en = position.en;
    }
    
    // Handle image update if a new file is provided
    if (req.file) {
      // Delete the old image
  if (member.image?.public_id) {
    try {
      await destroyImage(member.image.public_id);
      
      // Upload the new image
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: `${process.env.PROJECT_FOLDER || "MMAF"}/Members/${
          member.customId || nanoid()
        }`,
      });
      
      // Update the image object correctly
      member.image = {
        secure_url: uploadResult.url,
        public_id: uploadResult.fileId,
      };
    }
    catch (error) {
      console.error("Error deleting old image:", error);
      return res.status(500).json({ message: "Error deleting old image" });
    }
  }
}
    // Save the updated member
    await member.save();
    
    res.status(200).json({ message: "Member updated successfully", member });
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Error updating member", error: error.message });
  }
};


export { addMember, getMembers, getMemberById, deleteMember, updateMember };


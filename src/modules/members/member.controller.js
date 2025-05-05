import { nanoid } from "nanoid";
import { membersModel } from "../../../db/models/members.model.js";
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js";

const addMember = async (req, res, next) => {
  try {
    const { name_ar, name_en, position_ar, position_en } = req.body;

    // Validate required fields
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

    res.status(200).json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error });
  }
};

const getMembers = async (req, res, next) => {
  try {
    const members = await membersModel.find();
    res.status(200).json({ message: "Members fetched successfully", members });
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
    const { name_ar, name_en, position_ar, position_en } = req.body;
    const id = req.params.id;

    // Find the member by ID
    const member = await membersModel.findById(id);

    // Check if member exists
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Update fields if provided
    if (name_ar) member.name.ar = name_ar;
    if (name_en) member.name.en = name_en;
    if (position_ar) member.position.ar = position_ar;
    if (position_en) member.position.en = position_en;

    // Handle image update if a new file is provided
    if (req.file) {
      // Delete the old image
  if (member.image?.public_id) {
    try {
      await destroyImage(member.image.public_id);
    } catch (err) {
      console.warn(`Failed to delete old image: ${err.message}`);
      // Optionally: continue even if deletion fails
    }
  }
      // Upload the new image
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: `${process.env.PROJECT_FOLDER || "MMAF"}/Members/${
          member.customId || nanoid()
        }`,
      });

      member.image = {
        secure_url: uploadResult.url,
        public_id: uploadResult.fileId,
      };
    }

    // Save the updated member
    await member.save();

    res.status(200).json({ message: "Member updated successfully", member });
  } catch (error) {
    res.status(500).json({ message: "Error updating member", error });
  }
};

export { addMember, getMembers, getMemberById, deleteMember, updateMember };

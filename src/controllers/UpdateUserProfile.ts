import { Request, Response } from "express";
import uploadImage from "../middlewares/uploadImage";
import userModel from "../models/userModel";

const allowedFields = [
  "firstName",
  "lastName",
  "email",
  "hostel",
  "area",
  "phone",
  "program",
  "year",
  "college",
];

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updateData: Record<string, any> = {};

    if (req.file) {
      const profileUrl = await uploadImage(req.file.buffer, "profileImages");
      updateData["profile.profilePicUrl"] = profileUrl;
    }

    Object.entries(req.body).forEach(([key, value]) => {
      //   console.log(`${key}: ${value}`);
      if (!allowedFields.includes(key)) return;
      updateData[`profile.${key}`] = value;
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("updated user", updatedUser);

    return res.status(200).json({
      success: true,
      message: "Update successful",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export default updateUserProfile;

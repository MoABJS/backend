import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import postModel from "../models/postModel";
import { AuthPayload } from "../types/auth";

const allowedStatuses = ["pending", "approved", "rejected", "reunited"];

const UpdatePostStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const { postStatus } = req.body;
    if (!postStatus || !allowedStatuses.includes(postStatus)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: `postStatus is required and must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const post = await postModel.findById(id);
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Post not found",
      });
    }

    const requesterId = (req.user as AuthPayload).userId;
    if (!requesterId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Unauthorized" });
    }

    if (requesterId !== post.userId.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: "Not allowed" });
    }

    post.postStatus = postStatus;
    await post.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Post status updated" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: (error as Error).message });
  }
};

export default UpdatePostStatus;

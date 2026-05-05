import { Response, Request } from "express";
import postModel from "../models/postModel";
import { StatusCodes } from "http-status-codes";
import uploadImage from "../middlewares/uploadImage";

const addPosts = async (req: Request, res: Response) => {
  try {
    const { itemName, itemDescription, postType, location, date, userId } =
      req.body;

    // Upload image to Cloudinary

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Image file is required",
      });
    }

    const imageUrl = await uploadImage(req.file.buffer, "postsImages");

    const newPost = new postModel({
      itemName,
      itemDescription,
      postType,
      location,
      date,
      imageUrl,
      postStatus: "pending",
      userId,
    });

    await newPost.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Post created",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export default addPosts;

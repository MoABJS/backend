import { Request, Response } from "express";
import postModel from "../models/postModel";
import { StatusCodes } from "http-status-codes";

const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await postModel.find();

    console.log("posts to see id", posts);

    return res.status(StatusCodes.OK).json({
      success: true,
      posts: posts,
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

export default getPosts;

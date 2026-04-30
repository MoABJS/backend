import { Request, Response } from "express";
import { AuthPayload } from "../types/auth";
import userModel from "../models/userModel";
import { StatusCodes } from "http-status-codes";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as AuthPayload).userId;
    const user = await userModel.findById(userId);

    // console.log("user", user);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "No user found" });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      user: {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
};

export default getCurrentUser;

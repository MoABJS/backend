import { Request, Response } from "express";
import userModel from "../models/userModel";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface SignInBody {
  email: string;
  password: string;
}

const SignIn = async (req: Request<{}, {}, SignInBody>, res: Response) => {
  try {
    const { email, password } = req.body;
    const isUser = await userModel.findOne({ email });

    if (!isUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No user found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, isUser?.password);

    if (!isPasswordMatch) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No user found",
      });
    }

    const token = jwt.sign(
      { userId: isUser._id },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      // sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Log in successful",
    });
  } catch (error) {
    if (error instanceof Error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
  }
};

export default SignIn;

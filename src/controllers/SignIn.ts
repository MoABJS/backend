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

    console.log("isUser", isUser);

    if (!isUser.password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          "This account uses Google sign-in. Please sign in with Google.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, isUser?.password!);

    console.log("ispassword", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No user found",
      });
    }

    if (!isUser.isVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign(
      { userId: isUser._id },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1d",
      },
    );
    console.log("token before", token);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Log in successful",
      user: {
        userId: isUser.id,
        email: isUser.email,
        isVerified: isUser.isVerified,
        firstName: isUser.firstName,
        lastName: isUser.lastName,
      },
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

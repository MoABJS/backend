import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth";
import userModel from "../models/userModel";

// interface AuthPayload {
//   userId: string;
// }

const jwtAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    console.log("token after", token);

    const accessToken = token;

    if (!accessToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const jwtToken = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY!,
    ) as AuthPayload;

    console.log("jwt", jwtToken);

    if (!jwtToken) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: "Invalid token" });
    }

    // const user = await userModel.findById(jwtToken.userId).select("-password");
    req.user = jwtToken;
    console.log("user", req.user);

    next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
  }
};

export default jwtAuthorization;

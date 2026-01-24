import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthPayload } from "../types/auth";

const SignOut = (req: Request, res: Response) => {
    try {
        const user = req.user
        console.log("before", user)

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "You are not signed In" })
        }

    res.clearCookie("token", {
      httpOnly: true,
      // sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    })
    req.user = undefined;
    console.log("after", user)
    return res.status(StatusCodes.OK).json({success: true, message: "You have logged out successfully"

    })
    } catch (error) {
        if (error instanceof Error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: error.message})
    }
}
 
export default SignOut;
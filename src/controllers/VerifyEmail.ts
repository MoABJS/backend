import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userModel from "../models/userModel";

const VerifyEmail = async (req: Request, res: Response) => {
    try {
        const {token} = req.query;
        console.log("token in verify email", token)
        if (!token || typeof token !== "string") {
            return res.status(StatusCodes.BAD_REQUEST).json({success: false, message: "Invalid token"})
        }

        const user = await userModel.findOne({
            verificationToken: token,
            // verificationTokenExpires: {$gt: new Date()}
        })
console.log("user in verify email", user)
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({success: false, message: "Token Invalid"})
        }

        if (user.verificationTokenExpires! < new Date() ) {
return res.status(StatusCodes.BAD_REQUEST).json({success: false, message: "Token expired"})
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpires = undefined

        await user.save()

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Email verified successfully. You can now log in."
        })
    } catch (error) {
        if (error instanceof Error) 
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false, message: error.message})
    }
}
 
export default VerifyEmail;
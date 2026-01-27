import bcrypt from "bcryptjs";
import userModel from "../models/userModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto"
import SendMailVerification from "../utils/sendMailVerification";

interface SignUpBody {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  googleId?: string;
  isVerified: boolean;
  verificationToken?: string,
  verificationTokenExpires?: Date;
  provider?: string;
}

const SignUp = async (req: Request<{}, {}, SignUpBody>, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser?.provider === "google") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: "GOOGLE_ACCOUNT_EXISTS",
      message: "This email is registered using Google. Please sign in with Google."
      })
    }

    if (existingUser?.provider === "local" || existingUser?.provider === "local+google" ) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ code: "EMAIL_ACCOUNT_EXISTS",
      message: "An account with this email already exists. Please log in." });
    }

    const encryptedPassword = await bcrypt.hash(password!, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex")
    console.log("verificationToken", verificationToken)

    // console.log("e. password", encryptedPassword)

    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      provider: "local"
    });

     await newUser.save();

    await SendMailVerification(email, verificationToken)

   

    // const userWithoutPassword = {
    //   ...user.toObject(),
    //   password: undefined,
    // };
    // console.log("New user created: ", user);
    // return res.status(StatusCodes.CREATED).json({
    //   success: true,
    //   message: "New user created",
    //   user: userWithoutPassword,
    // });
    return res.status(StatusCodes.CREATED).json({success: true, message: "Registration successful. Please check your email to verify"})
  } catch (error) {
    if (error instanceof Error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
    // console.log("An error occurred: ", error);
  }
};

export default SignUp;

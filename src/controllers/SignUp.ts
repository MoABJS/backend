import bcrypt from "bcryptjs";
import userModel from "../models/userModel";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface SignUpBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUp = async (req: Request<{}, {}, SignUpBody>, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "User already exist" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    console.log("e. password", encryptedPassword);

    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    });

    const user = await newUser.save();

    const userWithoutPassword = {
      ...user.toObject(),
      password: undefined,
    };
    console.log("New user created: ", user);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "New user created",
      user: userWithoutPassword,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false });
    // console.log("An error occurred: ", error);
  }
};

export default SignUp;

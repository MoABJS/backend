import mongoose from "mongoose";

// export type ProfileProp = {
//   profilePic: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   hostel: string;
//   area: string;
//   phone: string;
//   program: string;
//   year: string;
//   college: string;
// };

const profileSchema = new mongoose.Schema(
  {
    profilePicUrl: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    hostel: {
      type: String,
    },
    area: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    program: {
      type: String,
    },
    year: {
      type: String,
    },
    college: {
      type: String,
    },
  },
  { versionKey: false, timestamps: false },
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    provider: {
      type: String,
      enum: {
        values: ["local", "google", "local+google"],
        message: "{VALUE} is not a valid provider",
      },
    },
    profile: {
      type: profileSchema,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const userModel = mongoose.model("users", userSchema);

export default userModel;

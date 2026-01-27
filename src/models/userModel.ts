import mongoose from "mongoose";

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
      default: false
    },
    verificationToken: {
      type: String
    },
    verificationTokenExpires: {
      type: Date
    }, 
    provider: {
      type: String,
      enum: {
        values: ["local", "google", "local+google"],
        message: "{VALUE} is not a valid provider"
      }
    }
  },
  { versionKey: false, timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;

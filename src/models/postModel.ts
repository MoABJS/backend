import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    itemDescription: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      required: true,
      enum: ["lost", "found"],
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    postStatus: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected", "reunited"],
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const postModel = mongoose.model("posts", postSchema);

export default postModel;

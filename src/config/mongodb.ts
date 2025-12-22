import mongoose from "mongoose";

const URI_STRING = process.env.MONGO_URI;

const connectToDB = async () => {
  try {
    await mongoose.connect(URI_STRING!);
    console.log("Db connected");
  } catch (error) {
    console.log("error: ", error);
  }
};

export default connectToDB;

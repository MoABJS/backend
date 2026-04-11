import cloudinary from "../config/cloudinary";

const uploadImage = async (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "postsImages", resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve(result.secure_url);
      },
    );
    stream.end(fileBuffer);
  });
};

export default uploadImage;

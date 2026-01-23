import dotenv from "dotenv";
import cookieParser from "cookie-parser"

dotenv.config();

import express from "express";
import connectToDB from "./config/mongodb";
import SignUp from "./controllers/SignUp";
import SignIn from "./controllers/SignIn";
import userSignUpValidation from "./validators/userSignUpValidation";
import validate from "./middlewares/validate";
import userSignInValidation from "./validators/userSignInValidation";
import jwtAuthorization from "./middlewares/jwtAuthorization";

export const app = express();

app.use(express.json());
app.use(cookieParser())

connectToDB();
app.get("/", jwtAuthorization, (req, res) => {
  res.send("Hello there, just start");
});

app.post("/sign-up", userSignUpValidation, validate, SignUp);
app.post("/sign-in", userSignInValidation, validate, SignIn);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server is running on port 3000");
});

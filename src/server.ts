import dotenv from "dotenv";
import cookieParser from "cookie-parser"

dotenv.config();

import express from "express";
import connectToDB from "./config/mongodb";
import routes from "./routes/routes";
import passport from "passport";
import "./config/google_passport"

export const app = express();

app.use(express.json());
app.use(cookieParser())

connectToDB();

app.use("/api", routes)
app.use(passport.initialize())

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server is running on port 3000");
});

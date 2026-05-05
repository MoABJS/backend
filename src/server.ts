import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import express from "express";
import connectToDB from "./config/mongodb";
import routes from "./routes/routes";
import passport from "passport";
import "./config/google_passport";

export const app = express();
app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToDB();

app.use("/api", routes);

const PORT = process.env.PORT || 5000;

console.log(PORT);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

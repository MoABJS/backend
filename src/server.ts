import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

dotenv.config();

import connectToDB from "./config/mongodb";
import routes from "./routes/routes";
import passport from "passport";
import "./config/google_passport";
import http from "http";
import { Server } from "socket.io";

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

// app.listen(PORT, () => {
//   console.log(`server is running on port ${PORT}`);
// });

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

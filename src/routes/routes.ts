import { Router } from "express";
import userSignInValidation from "../validators/userSignInValidation";
import validate from "../middlewares/validate";
import SignIn from "../controllers/SignIn";
import userSignUpValidation from "../validators/userSignUpValidation";
import SignUp from "../controllers/SignUp";
import jwtAuthorization from "../middlewares/jwtAuthorization";
import passport from "passport";
import jwt from "jsonwebtoken";
import SignOut from "../controllers/SignOut";
import VerifyEmail from "../controllers/VerifyEmail";
import getPosts from "../controllers/GetPosts";
import addPosts from "../controllers/AddPosts";
import postValidation from "../validators/postValidation";
import multer from "multer";
import getCurrentUser from "../controllers/GetCurrentUser";
import getUser from "../controllers/GetUser";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (_req, res) => {
  res.send("Hello there, just start");
});
router.get("/posts", jwtAuthorization, getPosts);
router.post("/sign-up", userSignUpValidation, validate, SignUp);
router.post("/sign-in", userSignInValidation, validate, SignIn);
router.get("/current-user", jwtAuthorization, getCurrentUser);
router.get("/users/:userId", getUser);
router.get("/auth/verify-email", VerifyEmail);
router.post("/sign-out", jwtAuthorization, SignOut);
router.post(
  "/add-post",
  jwtAuthorization,
  upload.single("image"),
  postValidation,
  validate,
  addPosts,
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/sign-in",
  }),
  (req, res) => {
    const user = req.user as any;

    // Create JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    });

    // Send token as cookie (recommended)
    res.cookie("token", token, {
      httpOnly: true,
      // sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Or redirect to frontend
    res.redirect("http://localhost:3000/api"); // your frontend URL
  },
);

export default router;

import { Router } from "express";
import userSignInValidation from "../validators/userSignInValidation";
import validate from "../middlewares/validate";
import SignIn from "../controllers/SignIn";
import userSignUpValidation from "../validators/userSignUpValidation";
import SignUp from "../controllers/SignUp";
import jwtAuthorization from "../middlewares/jwtAuthorization";
import passport from "passport";
import jwt from "jsonwebtoken"
import SignOut from "../controllers/SignOut";
import VerifyEmail from "../controllers/VerifyEmail";

const router = Router()


router.get("/", jwtAuthorization, (_req, res) => {
  res.send("Hello there, just start");
});
router.post("/sign-up", userSignUpValidation, validate, SignUp)
router.post("/sign-in", userSignInValidation, validate, SignIn)
router.get("/auth/verify-email", VerifyEmail)
router.get("/sign-out", jwtAuthorization, SignOut)

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
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
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1d" }
    );

    // Send token as cookie (recommended)
    res.cookie("token", token, {
      httpOnly: true,
      // sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Or redirect to frontend
    res.redirect("http://localhost:3000/api"); // your frontend URL
  }
);

export default router
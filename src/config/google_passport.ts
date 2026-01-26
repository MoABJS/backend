import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import userModel from "../models/userModel"; // adjust to your actual path

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const email = profile.emails?.[0].value;
        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";
        const googleId = profile.id;

        if (!email) {
          return done(new Error("Google account has no email"), undefined);
        }

        let user = await userModel.findOne({ email });

        if (user) {
          // If user exists but has no googleId yet, link it
          if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }

          return done(null, user);
        }

        // If user does not exist, create new user
        const newUser = await userModel.create({
          firstName,
          lastName,
          email,
          googleId,
          password: undefined, // no password for Google users
          isVerified: true
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as any, undefined);
      }
    }
  )
);

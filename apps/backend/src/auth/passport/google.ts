import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../../prisma/db";

const googleClient = process.env.GOOGLE_CLIENT_ID!;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET!;

export default new GoogleStrategy(
  {
    clientID: googleClient,
    clientSecret: googleSecret,
    callbackURL: "http://localhost:3001/api/v1/auth/google/callback",
  },
  async (_: any, __: any, profile: any, done: any) => {
    try {
      const user = await prisma.appUser.upsert({
        where: { email: profile.emails?.[0].value },
        update: {},
        create: {
          email: profile.emails?.[0].value,
          username: profile.displayName,
          googleId: profile.id
        },
      });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);


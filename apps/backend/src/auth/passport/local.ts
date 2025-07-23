import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { prisma } from "../../prisma/db";

export default new LocalStrategy(
  { usernameField: "email" },
  async (email: string, password: string, done: any) => {
    try {
      const user = await prisma.appUser.findFirst({
        where: {
          email
        }
      });
      if (!user) return done(null, false);

      const valid = await bcrypt.compare(password, user.passwordHash!);
      if (!valid) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);


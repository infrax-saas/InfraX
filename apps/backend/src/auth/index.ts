import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

export function generateToken(user: { id: string; email: string }) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export const authRouter = Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["email", "profile"], session: false }));

authRouter.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  const token = generateToken(req.user as any);
  console.log("her", `${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

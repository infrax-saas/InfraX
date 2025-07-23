import passport from "passport";
import localStrategy from "./local";
import googleStrategy from "./google";

export function setupPassport() {
  passport.use(localStrategy);
  passport.use(googleStrategy);
}


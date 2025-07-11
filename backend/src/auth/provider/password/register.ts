import { providerAuthRouter } from "..";
import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../../../types/authType";
import { createAccessToken, generateRefreshToken } from "../../utils/jwt";
import bcrypt, { hash } from "bcrypt";

providerAuthRouter.post(
  "/password/register",
  async (req: Request, res: Response) => {
    try {
      const requestBody = registerSchema.parse(req.body);

      if (!requestBody) {
        res.status(400).json({ msg: "Bad Request", data: null });
        return;
      }

      //check if user present

      const hashedPassword = await bcrypt.hash(requestBody.password, 12);

      //create user in DB

      const accessToken = createAccessToken(requestBody);

      if (!accessToken) {
        res.status(500).json({ msg: "Internal Server Error", data: null });
        return;
      }

      const refreshToken = generateRefreshToken();

      if (!refreshToken) {
        res.status(500).json({ msg: "Internal Server Error", data: null });
        return;
      }

      //store refreshtoken in refresh_token table

      res.cookie("_InfraX_refresh_token_", refreshToken, { httpOnly: true });

      res
        .status(200)
        .json({ msg: "Successfully Registered", data: accessToken });
    } catch (error) {
      res.status(500).json({ msg: "Internal Server Error", data: null });
      console.error(error);
      return;
    }
  }
);

providerAuthRouter.post(
  "/password/login",
  async (req: Request, res: Response) => {
    try {
      const reqBody = loginSchema.parse(req.body);

      if (!reqBody) {
        res.status(400).json({ msg: "Bad Request", data: null });
        return;
      }

      const password = reqBody.password;
      let hashedPassword = "";

      bcrypt.compare(password, hashedPassword);
    } catch (error) {}
  }
);

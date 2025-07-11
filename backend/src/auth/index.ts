import { Router } from "express";
import { providerAuthRouter } from "./provider";
import { appAuthRouter } from "./app";

export const authRouter = Router();

authRouter.use("/provider", providerAuthRouter);
authRouter.use("/app", appAuthRouter);

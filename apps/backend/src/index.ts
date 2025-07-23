import express from "express";
import cors from "cors";
import { providerAuthRouter } from "./auth/provider";
import { saasRouter } from "./saasconfig";
import { authRouter } from "./auth";
import { setupPassport } from "./auth/passport";
import passport from "passport";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

setupPassport();
app.use(passport.initialize())

app.use('/api/v1/provider/auth', providerAuthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/saasconfig', saasRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

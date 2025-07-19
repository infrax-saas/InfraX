import express from "express";
import cors from "cors";
import { authRouter } from "./auth/provider";
import { saasRouter } from "./saasconfig";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

app.use('/api/v1/provider/auth', authRouter);
app.use('/api/v1/saasconfig', saasRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

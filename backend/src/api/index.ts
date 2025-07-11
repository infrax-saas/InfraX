import express, { type Request, type Response } from "express";
import cors from "cors";

const PORT = process.env.PORT ?? 8000;

const app = express();
app.use(cors())

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})


import express from "express";
import cors from "cors";
import { prisma } from "../prisma/db";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());


app.post("/auth/google/callback", async (req, res) => {
  const { code, codeVerifier, redirectUri } = req.body;
  console.log(code, codeVerifier, redirectUri);
  console.log(redirectUri);
  if (!code || !codeVerifier || !redirectUri) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log('sending req to get token', process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return res.status(400).json({ error: "Google token exchange failed" });

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: tokenData.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: "Invalid ID token" });

    const googleId = payload.sub;
    const email = payload.email!;
    const image = payload.picture;
    const name = payload.name || "user";

    let user = await prisma.user.findUnique({ where: { googleId } });
    if (!user) {
      console.log('creating user', googleId, email, name);
      user = await prisma.user.create({
        data: {
          googleId,
          email,
          username: name,
          image,
          RefreshToken: {
            create: {
              token: tokenData.refresh_token!,
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            },
          },
        },
      });
    }

    const jwtToken = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        image: user.image,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


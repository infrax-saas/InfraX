import { prisma } from "../prisma/db";
import jwt from "jsonwebtoken";
import { auth, CodeChallengeMethod, OAuth2Client } from 'google-auth-library';
import { Router, type Request, type Response } from "express";
import cookie from "cookie";
import { authMiddleware } from "./authmiddleware";
import { id } from "zod/locales";
import { loginSchema, registerSchema } from "../types/authType";
import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export const authRouter = Router();

authRouter.post("/google/callback", async (req, res) => {
  const { code, codeVerifier, redirectUri, saasid } = req.body;
  console.log(code, codeVerifier, redirectUri);
  console.log(redirectUri);
  if (!code || !codeVerifier || !redirectUri) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {

    const provider = await prisma.provider.findFirst({
      where: {
        saasConfigId: saasid,
        type: "google"
      }
    })
    if (!provider) {
      return res.status(400).json({
        code: 400,
        message: `google auth not supported in saas with id: ${id}`,
        resonse: null
      })
    }

    const client_id = provider.appId;
    const client_secret = provider.secretKey;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: client_id,
        client_secret: client_secret,
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return res.status(400).json({ error: "Google token exchange failed" });

    const client = new OAuth2Client(client_id);
    const ticket = await client.verifyIdToken({
      idToken: tokenData.id_token,
      audience: client_id,
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
          saasId: saasid,
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

    res.setHeader("Set-Cookie", cookie.serialize("infrax_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    }));

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
  } finally {
    await prisma.$disconnect();
  }
});

authRouter.post("/github/callback", async (req: Request, res: Response) => {
  const { code, redirectUri, saasid } = req.body;

  if (!code || !redirectUri) {
    return res.status(400).json({
      code: 400,
      message: "code or redirectUri missing",
      response: null
    });
  }

  try {

    const provider = await prisma.provider.findFirst({
      where: {
        saasConfigId: saasid,
        type: "github"
      }
    });

    if (!provider) {
      return res.status(400).json({
        code: 400,
        message: `GitHub auth not supported in saas with id: ${saasid}`,
        resonse: null
      });
    }

    const client_id = provider.appId;
    const client_secret = provider.secretKey;

    const tokenRes = await fetch(`https://github.com/login/oauth/access_token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      return res.status(400).json({
        code: 400,
        message: `Token not found`,
        response: null
      });
    }

    const userRes = await fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json"
      }
    });

    const userData = await userRes.json();

    if (!userRes.ok || !userData.id) {
      return res.status(400).json({ error: "Failed to fetch GitHub user" });
    }

    const githubId = String(userData.id);
    const email = userData.email || `gh_${githubId}@placeholder.com`;
    const username = userData.name || userData.login || "github_user";
    const image = userData.avatar_url;

    let user = await prisma.user.findUnique({ where: { githubId } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId,
          email,
          username,
          image,
          saasId: saasid
        },
      });
    }

    const jwtToken = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.setHeader("Set-Cookie", cookie.serialize("infrax_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    }));

    return res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        image: user.image,
        username: user.username,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "internal server error",
      response: null
    });
  } finally {
    await prisma.$disconnect();
  }

})

authRouter.post("/signup", async (req: Request, res: Response) => {

  const { data, error } = registerSchema.safeParse(req.body);

  if (error) {
    return res.status(400).json({
      code: 400,
      message: 'Invalid body',
      response: null
    })
  }

  const { username, email, password, saasId } = data;

  try {

    const user = await prisma.user.findFirst({
      where: {
        username,
        saasId
      }
    })

    if (user) {
      return res.status(400).json({
        code: 400,
        message: `user already present`,
        resonse: null
      })
    }

    const hashedPassword = await hashPassword(password);

    const createUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        saasId
      }
    })

    return res.status(200).json({
      code: 200,
      message: "created user",
      response: createUser.id
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "internal server error",
      resonse: null
    })
  } finally {
    await prisma.$disconnect();
  }

})

authRouter.post("/signin", async (req: Request, res: Response) => {

  const { data, error } = loginSchema.safeParse(req.body);

  if (error) {
    return res.status(400).json({
      code: 400,
      message: 'Invalid body',
      response: null
    })
  };

  try {
    const { email, password, saasId } = data;

    const user = await prisma.user.findFirst({
      where: {
        email,
        saasId
      }
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "user not found",
        resonse: null
      })
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        code: 400,
        message: "wrong method for user",
        resonse: null
      })
    }

    const isPasswordCorrect = await comparePassword(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        code: 401,
        message: "wrong password",
        response: null
      })
    }

    const jwtToken = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.setHeader("Set-Cookie", cookie.serialize("infrax_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    }));

    return res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        image: user.image,
        username: user.username,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "internal server error",
      resonse: null
    })
  } finally {
    await prisma.$disconnect();
  }
})


authRouter.get("/me", authMiddleware, async (req, res) => {
  if (typeof req.user === "undefined") return res.status(500).json({ "message": "internal server error" })
  const user = await prisma.user.findUnique({
    where: { id: req.user.sub },
    select: {
      id: true,
      email: true,
      username: true,
      image: true,
    },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
});



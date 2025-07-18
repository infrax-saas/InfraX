import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { verifyGoogleIdToken, generateInfraXJwt, verifyInfraXJwt } from './authutils';
import { authMiddleware } from './authmiddleware';
import { prisma } from '../prisma/db';

const app = express();
const PORT = process.env.PORT || 3001;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const INFRAX_BASE_URL = process.env.INFRAX_BASE_URL!;

app.use(json());
app.use(cors({
  origin: true,
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Welcome to InfrAx Auth Server (Express)!');
});

app.post('/auth/google/callback', async (req, res) => {
  const { code, codeVerifier, redirectUri } = req.body;

  if (!code || !codeVerifier || !redirectUri) {
    return res.status(400).json({ message: 'Missing code, codeVerifier, or redirectUri.' });
  }

  const infrAxAppId = req.headers['x-infrax-app-id'];
  if (!infrAxAppId) {
    return res.status(400).json({ message: 'Missing X-InfrAx-App-Id header.' });
  }

  // validate this infrAxAppId

  try {

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${INFRAX_BASE_URL}/auth/google/callback`,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Google token exchange error:', errorData);
      return res.status(401).json({ message: `Google authentication failed: ${errorData.error_description || errorData.error}` });
    }

    const { access_token, id_token, refresh_token, expires_in } = await tokenResponse.json();

    const googlePayload = await verifyGoogleIdToken(id_token, GOOGLE_CLIENT_ID);
    const googleUserId = googlePayload.sub;
    const googleUserEmail = googlePayload.email;
    const googleUserName = googlePayload.name;
    const googleProfilePicture = googlePayload.picture;

    let user = await prisma.user.findUnique({
      where: { googleId: googleUserId },
    });

    if (!user) {
      // New user registration flow
      user = await prisma.user.create({
        data: {
          email: googleUserEmail,
          username: googleUserName,
          googleId: googleUserId,
          image: googleProfilePicture,
        },
      });
      console.log(`New user registered via Google: ${user.email}`);
    } else {
      console.log(`Existing user logged in via Google: ${user.email}`);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          username: googleUserName,
          image: googleProfilePicture,
        },
      });
    }

    if (refresh_token) {
      await prisma.refreshToken.deleteMany({
        where: { userId: user.id },
      });

      const refreshTokenExpiresAt = new Date();
      refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 90));

      await prisma.refreshToken.create({
        data: {
          token: refresh_token,
          userId: user.id,
          expiresAt: refreshTokenExpiresAt,
        },
      });
      console.log(`Stored new Google refresh token for user ${user.id}`);
    }

    const infrAxSessionToken = generateInfraXJwt({
      userId: user.id,
      email: user.email,
    });

    return res.status(200).json({
      message: 'Authentication successful',
      infrAxSessionToken: infrAxSessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.username,
        profilePictureUrl: user.image,
      },
    });

  } catch (error) {
    console.error('InfraX Auth Callback Error:', error);
    return res.status(500).json({ message: `Authentication failed: ${error}` });
  }

})

app.post('/auth/logout', authMiddleware, async (req, res) => {
  console.log(`User ${req.user?.userId} logged out.`);
  return res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/auth/me', authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: User not found in request context.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, username: true, image: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ message: 'Failed to fetch user data.' });
  }
});

app.post('/auth/token/refresh', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required for refresh.' });
  }

  try {

    const storedRefreshToken = await prisma.refreshToken.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
      return res.status(401).json({ message: 'No valid refresh token found. Please re-authenticate.' });
    }

    const googleRefreshResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: storedRefreshToken.token,
        grant_type: 'refresh_token',
      }),
    });

    if (!googleRefreshResponse.ok) {
      const errorData = await googleRefreshResponse.json();
      console.error('Google token refresh error:', errorData);

      if (errorData.error === 'invalid_grant' || errorData.error === 'unauthorized_client') {
        await prisma.refreshToken.delete({ where: { id: storedRefreshToken.id } });
      }
      return res.status(401).json({ message: 'Failed to refresh tokens with Google. Please re-authenticate.' });
    }

    const { access_token, id_token, expires_in, refresh_token: newGoogleRefreshToken } = await googleRefreshResponse.json();

    if (newGoogleRefreshToken) {
      await prisma.refreshToken.delete({ where: { id: storedRefreshToken.id } });
      const newRefreshTokenExpiresAt = new Date();
      newRefreshTokenExpiresAt.setDate(newRefreshTokenExpiresAt.getDate() + 90);
      await prisma.refreshToken.create({
        data: {
          token: newGoogleRefreshToken,
          userId: userId,
          expiresAt: newRefreshTokenExpiresAt,
        },
      });
      console.log(`Rotated Google refresh token for user ${userId}`);
    }

    const newGooglePayload = await verifyGoogleIdToken(id_token, GOOGLE_CLIENT_ID);

    const newInfraXSessionToken = generateInfraXJwt({
      userId: userId,
      email: newGooglePayload.email,
    });

    return res.status(200).json({
      message: 'Tokens refreshed successfully',
      infraXSessionToken: newInfraXSessionToken,
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({ message: `Failed to refresh token: ${error}` });
  }
})

app.listen(PORT, () => {
  console.log(`🚀 InfraX Auth Server running on http://localhost:${PORT}`);
});

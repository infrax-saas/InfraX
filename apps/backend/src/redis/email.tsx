import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '.';
import nodemailer from 'nodemaile';

const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Your OTP Code</title>
  </head>
  <body>
    <h2>Hello 👋</h2>
    <p>Your OTP code is: <strong>{{otp}}</strong></p>
    <p>This code will expire in 5 minutes.</p>
  </body>
</html>
`

export const otpRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'otp-rl',
  points: 5,
  duration: 300,
  blockDuration: 300,
});

export async function sendOtp(email: string) {
  try {
    await otpRateLimiter.consume(email);

    console.log("OTP can be sent");

  } catch (rateLimiterRes) {
    const retrySecs = Math.round(rateLimiterRes.msBeforeNext / 1000) || 60;
    throw new Error(`Too many requests. Try again in ${retrySecs} seconds.`);
  }
}

export const transporter = nodemailer.createTransport({
  host: "smtp.example.com",         // Replace with your SMTP
  port: 587,
  secure: false,
  auth: {
    user: "your@email.com",
    pass: "your_password",
  },
});

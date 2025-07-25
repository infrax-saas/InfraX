import createClient from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import nodemailer from 'nodemailer';
import handlebars from "handlebars";
import "dotenv/config";

const redisClient = new createClient();

const otpRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'otp-rl',
  points: 5,
  duration: 300,
  blockDuration: 300,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const templateHTML = `
<!DOCTYPE html>
<html>
  <body>
    <h2>Your OTP Code</h2>
    <p>Here is your OTP: <strong>{{otp}}</strong></p>
    <p>This code expires in 5 minutes.</p>
  </body>
</html>
`;

function compileTemplate(context: any): string {
  const template = handlebars.compile(templateHTML);
  return template(context);
}

export async function sendOtpWithRateLimit(email: string, otp: string) {
  try {
    await otpRateLimiter.consume(email);

    const html = compileTemplate({ otp });

    await transporter.sendMail({
      from: `"InfraX Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html,
    });

    console.log(`OTP sent to ${email}`);
  } catch (err: any) {
    if (err instanceof Error && err.message.includes("Too many requests")) {
      throw err;
    }

    const retrySecs = Math.round(err?.msBeforeNext / 1000) || 60;
    throw new Error(`Too many requests. Try again in ${retrySecs} seconds.`);
  }
}


import express, { type Request, type Response } from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import flash from "express-flash";
import { userModel } from "./models/userModel.js";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import "dotenv/config";

const nodeEnv = process.env.NODE_ENV as keyof typeof cgtdbEnv;
if (!nodeEnv) {
  throw new Error('NODE_ENV not available.')
}

app.listen(parseInt(process.env.NODE_PORT as string), '::', () => {
  console.log(`Caregiver tracker listening on port ${process.env.NODE_PORT}!`);
});
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redisClient = createClient({
  url: redisUrl,
});
const isProd = nodeEnv === "production";

await redisClient.connect().catch(console.error)
app.set("trust proxy", 1);
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(cookieParser())
app.use(session({
  store: new RedisStore({
    client: redisClient,
    prefix: 'session:',
  }),
  name: 'sessionId',
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  rolling: false,
  cookie: {
    secure: isProd,
    maxAge: 3600000,
    sameSite: isProd ? 'none' : 'lax',
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy({ usernameField: 'user_email' }, userModel.authenticate()))
passport.serializeUser(userModel.serializeUser() as any);
passport.deserializeUser(userModel.deserializeUser())

import user from "./routes/user.js";
import caretaken from "./routes/caretaken.js";
import feed from "./routes/feed.js";
import excretion from "./routes/excretion.js";
import inventory from "./routes/inventory.js";
import medication from "./routes/medication.js";
import base from "./routes/base.js";
import type { MongoServerError } from "mongodb";
import type { cgtdbEnv } from "./config.js";

app.use("/user", user);
app.use("/caretaken", caretaken);
app.use("/feed", feed);
app.use("/excretion", excretion);
app.use("/inventory", inventory);
app.use("/medication", medication);
app.use("/base", base);

app.use((err: MongoServerError, req: Request, res: Response) => {
  if (err.name === "MongoServerError") {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate values found' });
    }
    return res.status(500).json({ message: 'Database error' });
  }
  res.status(500).json({ message: err.message })
});


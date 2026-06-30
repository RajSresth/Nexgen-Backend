import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { globalApiLimiter } from "./middlewares/rateLimiters.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use("/api/v1", globalApiLimiter);
app.use("/api/v1/auth", authRoutes);


// global error handler middleware

export default app;

// http://localhost:3000/api/v1/auth/register
// http://localhost:3000/api/v1/auth/login

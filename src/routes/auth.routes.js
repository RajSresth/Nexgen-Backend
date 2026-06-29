import express from "express";
import { login, register, resendVerificationEmail, verifyEmail } from "../controllers/auth.controller.js";
import { resendVerificationLimiter } from "../middlewares/rateLimiters.js";
const authRoutes = express.Router();


authRoutes.post("/register",register);
authRoutes.post("/login",login);
authRoutes.get("/verify-email/:token", verifyEmail);
authRoutes.post(
  "/resend-verification-email",
  resendVerificationLimiter,
  resendVerificationEmail
);
export default authRoutes;
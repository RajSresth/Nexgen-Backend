import User from "../models/user.model.js";
import validate from "../utils/validate.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.utils.js";
import {
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
} from "../utils/email-token.utils.js";
import { sendVerificationEmail } from "../utils/mailer.utils.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    const { errors, hasError } = validate(fullname, email, password, role);
    if (hasError) {
      return res.status(400).json(errors);
    }

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User Already exist" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      password: passwordHash,
      role,
    });

    try {
      const token = generateEmailVerificationToken(user._id);
      const verifyUrl = `${process.env.API_BASE_URL}/api/v1/auth/verify-email/${token}`;
      await sendVerificationEmail(user.email, verifyUrl);
      user.lastVerificationEmailSentAt = new Date();
      await user.save();
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    return res.status(201).json({
      success: true,
      message:
        "User Registered Succesfully. Check your email to verify your account.",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Register Error", error });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    let payload;
    try {
      payload = verifyEmailVerificationToken(token);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link" });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(400).json({ message: "User no longer exists" });
    }
    if (user.isEmailVerified) {
      return res
        .status(200)
        .json({ success: true, message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify Email Error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during email verification" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    const genericResponse = {
      success: true,
      message:
        "If an account with that email exists and is unverified, a verification link has been sent.",
    };

    if (!user || user.isEmailVerified) {
      return res.status(200).json(genericResponse);
    }

    const COOLDOWN_MS = 60 * 1000;
    if (
      user.lastVerificationEmailSentAt &&
      Date.now() - user.lastVerificationEmailSentAt.getTime() < COOLDOWN_MS
    ) {
      return res.status(200).json(genericResponse);
    }

    const token = generateEmailVerificationToken(user._id);
    const verifyUrl = `${process.env.API_BASE_URL}/api/v1/auth/verify-email/${token}`;
    await sendVerificationEmail(user.email, verifyUrl);

    user.lastVerificationEmailSentAt = new Date();
    await user.save();

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Resend Verification Email Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const accessToken = await generateAccessToken(user._id, user.role);
    const refreshToken = await generateRefreshToken(user._id, user.role);

    const userData = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    };

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        accessToken,
        user: userData,
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during login" });
  }
};

export const logout = async (req, res) => {};

export const forgetPassword = async (req, res) => {};

export const verifyResetOtp = async (req, res) => {};

export const resetPassword = async (req, res) => {};

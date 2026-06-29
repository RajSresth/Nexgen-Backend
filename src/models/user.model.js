import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
      maxlength: [20, "Name can not be more than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [
        {
          validator: validator.isEmail,
          message: "Please enter a valid email address",
        },
        {
          validator: (email) =>
            /@(gmail\.com|outlook\.com|hotmail\.com)$/i.test(email),
          message: "Only Gmail and Outlook emails are allowed for registration",
        },
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isEmailVerified: { type: Boolean, default: false },
    lastVerificationEmailSentAt: { type: Date, default: null },
    profilePic: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpVerified: { type: Boolean, default: false },
    addresses: [
      {
        label: {
          type: String,
          enum: ["Home", "Work", "Other"],
          required: true,
        },
        fullAddress: { type: String, required: true, trim: true },
        landmark: { type: String, trim: true },
        pincode: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);


const User = mongoose.model("User", userSchema);

export default User;

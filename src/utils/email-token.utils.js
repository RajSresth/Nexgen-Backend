import jwt from "jsonwebtoken";

export const generateEmailVerificationToken = (userId) => {
  return jwt.sign(
    { id: userId, purpose: "email_verification" },
    process.env.JWT_EMAIL_SECRET,
    {
      expiresIn: "1h",
    },
  );
};

export const verifyEmailVerificationToken = (token) => {
  const payload = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
  if (payload.purpose !== "email_verification") {
    throw new Error("Invalid token purpose");
  }
  return payload;
};

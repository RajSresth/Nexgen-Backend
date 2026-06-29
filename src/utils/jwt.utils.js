import jwt from "jsonwebtoken";

export const generateAccessToken = (id,role) =>
  jwt.sign({ id,role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (id,role) =>
  jwt.sign({ id,role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });


export const verifyAccessToken = () => {
  
}

export const verifyRefreshToken = () => {

}
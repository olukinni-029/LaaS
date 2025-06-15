import dotenv from "dotenv";
dotenv.config();
import * as jwt from "jsonwebtoken";
import crypto from "crypto";

const session_key = process.env.SESSION_TOKEN_KEY as string;
export const generateToken = (payload: object, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const random = () => crypto.randomBytes(128).toString("base64");

export const generateSessionToken = (salt: string, email: string) => {
  return crypto
    .createHmac("sha512", [salt, email].join("/"))
    .update(session_key)
    .digest("hex");
};

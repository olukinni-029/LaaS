import dotenv from "dotenv";
dotenv.config();
import * as jwt from "jsonwebtoken";
import crypto from "crypto";
import { Role } from  '../../modules/auth/user.model';


interface TokenPayload {
  id: string;
  email: string;
  role: Role;
}

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

export const generateAccessAndRefreshTokens = (user: TokenPayload) => {
  const accessToken = generateToken(
    user,
    process.env.USER_JWT_SECRET!,
    '15m'
  );

  const refreshToken = generateToken(
    user,
    process.env.REFRESH_TOKEN_SECRET!,
    '7d'
  );

  return { accessToken, refreshToken };
};

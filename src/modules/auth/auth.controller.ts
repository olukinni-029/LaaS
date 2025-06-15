import asyncHandler from "../../utils/common/asyncHandler";
import { Request, Response } from "express";
import { isDisposableEmail } from "../../utils/common/email.validator";
import {
  errorResponse,
  successResponse,
} from "../../utils/serverresponse/successresponse";
import { UserService } from "./auth.service";
import { compare, hash } from "../../utils/hashes/hasher";
import { generateToken, verifyToken } from "../../utils/hashes/jwthandler";
import logger from "../../utils/logger";
import { SessionService } from "./session.service";
import { ISession } from "./token.model";
import { setRefreshTokenCookie } from "../../utils/hashes/cookies";

import { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const authController = {
  createUser: asyncHandler(async (req: Request, res: Response) => {
    const userData  = req.body

    const isValidEmail = isDisposableEmail(userData.email);
    if (isValidEmail) {
      logger.warn(`Blocked disposable email attempt: ${userData.email}`);
      return errorResponse(res, "Disposable email address is not allowed", 400);
    }

    const userEmail = await UserService.findOneByEmail(userData.email);
    if (userEmail) {
      logger.warn(`Duplicate email registration attempt: ${userData.email}`);
      return errorResponse(res, "User email already exists", 400);
    }

    userData.password = await hash(userData.password);

    const createUser = await UserService.createUser(userData);

    if (!createUser) {
      logger.error("User creation failed in the database");
      return errorResponse(res, "Error creating user", 500);
    }

    const tokenPayload = {
      email: createUser.email,
      role: createUser.role,
      id: createUser._id,
    };

    const token = generateToken(
      tokenPayload,
      process.env.USER_JWT_SECRET as string,
      "1d"
    );

    const dataInfo = {
      email: createUser.email,
      role: createUser.role,
      token,
    };

    logger.info("User created successfully", {
      timestamp: new Date().toISOString(),
      user: {
        id: createUser._id,
        email: createUser.email,
        role: createUser.role,
      },
    });

    return successResponse(res, dataInfo, "User created successfully");
  }),

  loginUser: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserService.findOneByEmail(email);
    if (!user) {
      return errorResponse(res, "User does not exist", 404);
    }

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Generate access and refresh tokens
    const accessToken = generateToken(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      "15m"
    );

    const refreshToken = generateToken(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.REFRESH_TOKEN_SECRET!,
      "7d"
    );

    // Store refresh token in session DB
    const sessionPayload: ISession = {
      userId: user._id.toString(),
      token: refreshToken,
      identifier: "refresh_token",
    };
    await SessionService.createSession(sessionPayload);

    // Set refresh token in HttpOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    // Return access token and user info
    const responseData = {
      email: user.email,
      role: user.role,
      accessToken,
      user,
    };

    return successResponse(res, responseData, "User logged in successfully");
  }),

  refreshAccessToken: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return errorResponse(res, "Refresh token missing", 401);
    }

    try {
      const payload = verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as TokenPayload;

      // Optional: check if token exists in sessions table
      const session = await SessionService.findOneSessionByToken(refreshToken);
      if (!session) {
        return errorResponse(res, "Invalid session", 403);
      }

      const secret = process.env.ACCESS_TOKEN_SECRET!;
      const newAccessToken = generateToken(
        {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        },
        secret,
        "15m"
      );

      return successResponse(
        res,
        { accessToken: newAccessToken },
        "Token refreshed"
      );
    } catch (err) {
      return errorResponse(res, "Invalid or expired refresh token", 401);
    }
  }),
};

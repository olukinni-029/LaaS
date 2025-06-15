import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/serverresponse/successresponse';
import { verifyToken } from '../utils/hashes/jwthandler';
import { TokenPayload, Role } from '../modules/auth/auth.type'; // Moved to a shared types file

// Extend Express Request to include `user`
declare module 'express-serve-static-core' {
  interface Request {
    user?: TokenPayload;
  }
}

/**
 * Middleware to authorize users based on JWT and optional role requirements.
 * Adds decoded token to req.user if valid.
 * 
 * @param roles - Array of allowed roles. If empty, any authenticated user is allowed.
 */
export const authorize =
  (roles: Role[] = []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token, process.env.USER_JWT_SECRET as string) as TokenPayload;

      if (!decoded?.id || !decoded?.email || !decoded?.role) {
        return errorResponse(res, 'Invalid token payload', 401);
      }

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return errorResponse(res, 'Forbidden: insufficient role', 403);
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error); // Optional: useful for debugging
      return errorResponse(res, 'Unauthorized', 401);
    }
  };

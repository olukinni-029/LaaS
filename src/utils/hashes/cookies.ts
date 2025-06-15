import { Response } from 'express';

export const setSessionTokenCookie = (res: Response, sessionToken: string): void => {
  res.cookie('sessionToken', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'none',
    path: '/',
  });
};

export const clearSessionTokenCookie = (res: Response): void => {
  res.clearCookie('sessionToken');
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'none',
    path: '/',
  });
};

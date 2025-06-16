import { authController } from '../modules/auth/auth.controller';
import { UserService } from '../modules/auth/auth.service';
import { SessionService } from '../modules/auth/session.service';
import { compare } from '../utils/hashes/hasher';
import { generateAccessAndRefreshTokens } from '../utils/hashes/jwthandler';
import { setRefreshTokenCookie } from '../utils/hashes/cookies';
import { Request, Response } from 'express';

jest.mock('../modules/auth/auth.service');
jest.mock('../modules/auth/session.service');
jest.mock('../utils/hashes/hasher');
jest.mock('../utils/hashes/jwthandler');
jest.mock('../utils/hashes/cookies');

const mockRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authController.loginUser', () => {
  it('should return access token for valid credentials', async () => {
    const req = {
      body: { email: 'test@example.com', password: 'secret' }
    } as Partial<Request> as Request;

    const res = mockRes();
    const next = jest.fn();

    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: 'hashed-password',
      role: 'customer'
    };

    (UserService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
    (compare as jest.Mock).mockResolvedValue(true);
    (generateAccessAndRefreshTokens as jest.Mock).mockReturnValue({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken'
    });
    (SessionService.createSession as jest.Mock).mockResolvedValue(undefined);
    (setRefreshTokenCookie as jest.Mock).mockImplementation(() => {});

    await authController.loginUser(req, res, next);

    expect(UserService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
    expect(compare).toHaveBeenCalledWith('secret', 'hashed-password');
    expect(generateAccessAndRefreshTokens).toHaveBeenCalledWith({
      id: 'user123',
      email: 'test@example.com',
      role: 'customer'
    });
    expect(SessionService.createSession).toHaveBeenCalled();
    expect(setRefreshTokenCookie).toHaveBeenCalledWith(res, 'mockRefreshToken');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: expect.any(Object) })
    );
  });
});
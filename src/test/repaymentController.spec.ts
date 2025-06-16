import { repayController } from '../modules/repayment/repay.controller';
import { RepayService } from '../modules/repayment/repayment.service';
import { Request, Response } from 'express';

jest.mock('../modules/repayment/repayment.service');

const mockRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('repayController.repayLoan', () => {
  const mockUser = {
  id: 'user123',
  email: 'user@example.com',
  role: 'customer'
};


  it('should successfully repay loan', async () => {
    const req = {
      user: mockUser,
      params: { loanId: 'loan123' },
      body: { amount: 1000 },
    } as Partial<Request> as Request;

    const res = mockRes();
    const next = jest.fn();

    const mockLoan = { id: 'loan123', balance: 4000 };
    (RepayService.repayLoan as jest.Mock).mockResolvedValue(mockLoan);

    await repayController.repayLoan(req, res, next);

    expect(RepayService.repayLoan).toHaveBeenCalledWith('loan123', 1000, 'user123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: mockLoan })
    );
  });

  it('should return 401 if user is missing', async () => {
    const req = {
      user: undefined,
      params: { loanId: 'loan123' },
      body: { amount: 1000 },
    } as Partial<Request> as Request;

    const res = mockRes();
    const next = jest.fn();

    await repayController.repayLoan(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Unauthorized' })
    );
  });
});

import { loanController } from '../modules/loan/loan.controller';
import { LoanService } from '../modules/loan/loan.service';
import { UserService } from '../modules/auth/auth.service';
import { generateVirtualAccount } from '../utils/common/generateVirtualAcc';
import { Request, Response } from 'express';

jest.mock('../modules/loan/loan.service');
jest.mock('../modules/auth/auth.service');
jest.mock('../utils/common/generateVirtualAcc');

const mockRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('loanController', () => {
  const mockUser = { id: 'user1', email: 'user@example.com', role: 'customer' };

  describe('applyForLoan', () => {
    it('should create a loan if user has no active loan', async () => {
      const req = { user: mockUser, body: { amount: 5000 } } as Request;
      const res = mockRes();

      (UserService.findOneById as jest.Mock).mockResolvedValue(mockUser);
      (LoanService.getActiveLoanByBorrowerId as jest.Mock).mockResolvedValue(null);
      (LoanService.createLoan as jest.Mock).mockResolvedValue({ amount: 5000 });

      await loanController.applyForLoan(req, res, jest.fn());

      expect(LoanService.createLoan).toHaveBeenCalledWith({ borrowerId: 'user1', amount: 5000 });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should block user with existing loan', async () => {
      const req = { user: mockUser, body: { amount: 5000 } } as Request;
      const res = mockRes();

      (UserService.findOneById as jest.Mock).mockResolvedValue(mockUser);
      (LoanService.getActiveLoanByBorrowerId as jest.Mock).mockResolvedValue({});

      await loanController.applyForLoan(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('approveLoan', () => {
    it('should approve loan with valid approver', async () => {
     const req = {
  user: mockUser,
  params: { loanId: 'loan123' }
} as Partial<Request> as Request;


      const res = mockRes();

      (generateVirtualAccount as jest.Mock).mockReturnValue('VA123');
      (LoanService.approveLoan as jest.Mock).mockResolvedValue({ status: 'approved' });

      await loanController.approveLoan(req, res, jest.fn());

      expect(LoanService.approveLoan).toHaveBeenCalledWith('loan123', 'user1', 'VA123');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('rejectLoan', () => {
    it('should reject loan with valid approver', async () => {
      const req = {
  user: mockUser,
  params: { loanId: 'loan123' }
} as Partial<Request> as Request;


      const res = mockRes();

      (LoanService.rejectLoan as jest.Mock).mockResolvedValue({ status: 'rejected' });

      await loanController.rejectLoan(req, res, jest.fn());

      expect(LoanService.rejectLoan).toHaveBeenCalledWith('loan123', 'user1');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getLoans', () => {
    it('should fetch loans with filters', async () => {
      const req = {
  query: {
    page: '1',
    limit: '10',
    status: '',
    search: ''
  }
} as Partial<Request> as Request;

      const res = mockRes();

      (LoanService.getLoanListWithFilters as jest.Mock).mockResolvedValue([]);

      await loanController.getLoans(req, res, jest.fn());

      expect(LoanService.getLoanListWithFilters).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        status: '',
        search: ''
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

import { Request, Response } from "express";
import asyncHandler from "../../utils/common/asyncHandler";
import { UserService } from "../auth/auth.service";
import {
  errorResponse,
  successResponse,
} from "../../utils/serverresponse/successresponse";
import { LoanService } from "./loan.service";
import { generateVirtualAccount } from "../../utils/common/generateVirtualAcc";

export const loanController = {
  applyForLoan: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { amount } = req.body;

if (!userId) {
    return errorResponse(res, 'Unauthorized', 401);
  }

    const user = await UserService.findOneById(userId);
    if (!user) {
      return errorResponse(res, "User doesn't exist", 404);
    }
    const existingLoan = await LoanService.getActiveLoanByBorrowerId(userId);
    if (existingLoan) {
      return errorResponse(
        res,
        "You already have an active or pending loan",
        400
      );
    }

    const loanData = {
      borrowerId: userId,
      amount,
    };

    const loan = await LoanService.createLoan(loanData);

    if (!loan) {
      return errorResponse(res, "Error creating loan", 500);
    }

    return successResponse(res, loan, "Loan created successfully");
  }),

  approveLoan: asyncHandler(async (req: Request, res: Response) => {
    const approverId = req.user?.id;
    const { loanId } = req.params;

    if (!approverId) {
        return errorResponse(res, 'Unauthorized', 401);
      }
    const virtualAccountNumber = generateVirtualAccount();
    const loan = await LoanService.approveLoan(
      loanId,
      approverId,
      virtualAccountNumber
    );

    return successResponse(res, loan, "Loan approved successfully");
  }),

 rejectLoan: asyncHandler(async (req: Request, res: Response) => {
  const approverId = req.user?.id;
  const { loanId } = req.params;

  if (!approverId) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  const loan = await LoanService.rejectLoan(loanId, approverId);
  return successResponse(res, loan, "Loan rejected successfully");
}),


  getLoans: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, search } = req.query;

    const result = await LoanService.getLoanListWithFilters({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      status: status as string,
      search: search as string,
    });

    return successResponse(res, result, "Loan list fetched successfully");
  }),
};

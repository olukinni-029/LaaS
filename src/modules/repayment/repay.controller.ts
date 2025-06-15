import { Request, Response } from "express";
import asyncHandler from "../../utils/common/asyncHandler";
import {RepayService} from "../repayment/repayment.service"
import {
  errorResponse,
  successResponse,
} from "../../utils/serverresponse/successresponse";


export const repayController = {
repayLoan: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { loanId } = req.params;
    const { amount } = req.body;

if (!userId) {
    return errorResponse(res, 'Unauthorized', 401);
  }
    const loan = await RepayService.repayLoan(loanId, Number(amount), userId);

    return successResponse(res, loan, "Repayment successful");
  }),
  
}
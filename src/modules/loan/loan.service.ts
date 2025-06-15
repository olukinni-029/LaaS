import LoanModel, { Status } from "./loan.model";
import { loanEvents, LoanEventTypes } from "../../utils/common/event";
import dayjs from "dayjs";
import { LoanQueryOptions } from "../loan/loan.types";

export class LoanService {
  public static async createLoan(data: { borrowerId: string; amount: number }) {
    return LoanModel.create({
      borrowerId: data.borrowerId,
      amount: data.amount,
    });
  }

  public static async approveLoan(
    loanId: string,
    approverId: string,
    virtualAccountNumber: string
  ) {
    const loan = await LoanModel.findOneAndUpdate(
      {
        _id: loanId,
        status: Status.PENDING,
      },
      {
        status: Status.APPROVED,
        approvedBy: approverId,
        virtualAccountNumber,
      },
      { new: true }
    );

    if (!loan) {
      throw new Error("Loan not found or already processed");
    }
    const COMMISSION_RATE = 0.02;

    loan.balance = loan.amount;
    loan.lenderId = approverId;
    loan.commissionAmount = loan.amount * COMMISSION_RATE;
    loan.dueDate = dayjs().add(30, "day").toDate();
    const savedLoan = await loan.save();

    loanEvents.emit(LoanEventTypes.LOAN_APPROVED, {
      loanId: savedLoan._id,
      borrowerId: savedLoan.borrowerId,
      amount: savedLoan.amount,
      virtualAccountNumber: savedLoan.virtualAccountNumber,
    });

    return savedLoan;
  }

  public static async repayLoan(
    loanId: string,
    amount: number,
    userId: string
  ) {
    const loan = await LoanModel.findById(loanId);

    if (!loan) throw new Error("Loan not found");
    if (loan.borrowerId.toString() !== userId)
      throw new Error("Unauthorized: Not your loan");
    if (loan.status !== Status.APPROVED)
      throw new Error("Cannot repay: Loan is not approved");
    if (loan.balance <= 0) throw new Error("Loan is already fully repaid");

    loan.balance -= amount;

    if (loan.balance <= 0) {
      loan.balance = 0;
      loan.status = Status.REPAID;

      loanEvents.emit(LoanEventTypes.REPAYMENT_COMPLETED, {
        loanId: loan._id,
        borrowerId: loan.borrowerId,
        amountRepaid: amount,
      });
    }

    return await loan.save();
  }

  public static async rejectLoan(loanId: string, rejectedBy: string) {
    const loan = await LoanModel.findOneAndUpdate(
      {
        _id: loanId,
        status: Status.PENDING,
      },
      {
        status: Status.REJECTED,
        approvedBy: rejectedBy,
      },
      { new: true }
    );

    if (!loan) {
      throw new Error(
        "Loan not found or cannot be rejected (already processed)"
      );
    }

    return loan;
  }

  public static async getActiveLoanByBorrowerId(borrowerId: string) {
    return LoanModel.findOne({
      borrowerId,
      status: { $in: [Status.PENDING, Status.APPROVED] },
    });
  }

  public static async getLoanById(loanId: string) {
    return LoanModel.findById(loanId);
  }

 public static async getLoanListWithFilters({
    page = 1,
    limit = 10,
    status,
    search,
  }: LoanQueryOptions) {
    const query: any = {};

    if (status) {
      query.status = status.toLowerCase();
    }

    const borrowerMatch: any = {};
    if (search) {
      borrowerMatch.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const loans = await LoanModel.find(query)
      .populate({
        path: "borrowerId",
        match: borrowerMatch,
        select: "name email",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const filteredLoans = loans.filter((loan) => loan.borrowerId);

    const total = await LoanModel.countDocuments(query);

    return {
      data: filteredLoans,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } 

}

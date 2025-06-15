import LoanModel, { Status } from "../loan/loan.model";
import { loanEvents, LoanEventTypes } from "../../utils/common/event";

export class RepayService {
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
}

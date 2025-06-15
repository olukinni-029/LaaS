import cron from "node-cron";
import LoanModel, { Status } from "../../modules/loan/loan.model";
import { loanEvents, LoanEventTypes } from "./event";

// This runs every day at 9:00 AM
cron.schedule("0 9 * * *", async () => {
  console.log("[CRON] Checking for due repayments...");

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Remove time precision

  const dueLoans = await LoanModel.find({
    status: Status.APPROVED,
    dueDate: { $lte: today },
    balance: { $gt: 0 },
  });

  dueLoans.forEach((loan) => {
    loanEvents.emit(LoanEventTypes.REPAYMENT_DUE, {
      loanId: loan._id,
      borrowerId: loan.borrowerId,
      dueDate: loan.dueDate,
    });
  });
});

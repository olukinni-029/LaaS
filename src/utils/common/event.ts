import { EventEmitter } from "events";

class LoanEventEmitter extends EventEmitter {}
export const loanEvents = new LoanEventEmitter();

export const LoanEventTypes = {
  LOAN_APPROVED: "loan.approved",
  REPAYMENT_DUE: "repayment.due",
  REPAYMENT_COMPLETED: "repayment.completed",
};

import { loanEvents, LoanEventTypes } from "./event";
import { io, clients } from "../socket";

function emitToUser(userId: string, event: string, payload: any) {
  const socketId = clients.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, payload);
  }
}

// Loan approved
loanEvents.on(LoanEventTypes.LOAN_APPROVED, (data) => {
  emitToUser(data.borrowerId, "loan:approved", {
    message: `Loan approved! Amount: ₦${data.amount}`,
    loanId: data.loanId,
  });
});

// Repayment completed
loanEvents.on(LoanEventTypes.REPAYMENT_COMPLETED, (data) => {
  emitToUser(data.borrowerId, "repayment:completed", {
    message: `Repayment completed for loan ${data.loanId}`,
  });
});

// Repayment due
loanEvents.on(LoanEventTypes.REPAYMENT_DUE, (data) => {
  emitToUser(data.borrowerId, "repayment:due", {
    message: `Reminder: Repayment due for loan ${data.loanId}`,
  });
});

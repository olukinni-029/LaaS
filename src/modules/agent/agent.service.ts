import LoanModel from "../../modules/loan/loan.model";


export class AgentService {
  public static async getCommissionHistory(lenderId: string) {
      const loans = await LoanModel.find({ lenderId, status: "approved" })
        .select("amount commissionAmount borrowerId createdAt")
        .populate("borrowerId", "name email");
  
      const totalEarnings = loans.reduce(
        (sum, loan) => sum + (loan.commissionAmount || 0),
        0
      );
  
      return {
        totalEarnings,
        loans,
      };
    }
}
import mongoose from 'mongoose';

export enum Status {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    REPAID = 'repaid'
}

export interface ILoan extends Document {
  amount: number;
  term: string;
  interestRate: number;
  status: Status;
  borrowerId: string;
  lenderId?: string;
  approvedBy?: string;
  virtualAccountNumber: string;
  balance: number;
  dueDate?: Date;
  commissionAmount : number

}

const loanSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  term: { type: String,default:"1 month"},
  interestRate: { type: Number,default:0.05},
  status: { type: String, enum: Object.values(Status),
      default: Status.PENDING},
  borrowerId: { type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
     required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId,ref:'User' },
  virtualAccountNumber: { type: String},
  balance: { type: Number,default:0.0 },
  dueDate: { type: Date },
  commissionAmount: { type: Number, default: 0 },
}, { timestamps: true });

const LoanModel = mongoose.model<ILoan>('Loan', loanSchema);

export default LoanModel;
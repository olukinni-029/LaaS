import { Router } from 'express';
import { authorize } from '../../middlewares/authentication';
import { repayController } from './repay.controller';
import { schemas, validate } from '../loan/LoanDto';



const repayRoute:Router = Router();

repayRoute.post('/:loanId', authorize(['customer']),validate(schemas.RepayLoanSchema), repayController.repayLoan);

export default repayRoute;
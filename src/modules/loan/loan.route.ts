import { Router } from 'express';
import { authorize } from '../../middlewares/authentication';
import { schemas, validate } from './LoanDto';
import { loanController } from './loan.controller';

const loanRoute: Router = Router();

loanRoute.post('/apply',authorize(['customer']),validate(schemas.ApplyLoanSchema),loanController.applyForLoan);
loanRoute.patch('/:loanId/approve', authorize(['admin']), loanController.approveLoan);
loanRoute.patch('/:loanId/reject', authorize(['admin']), loanController.rejectLoan);
loanRoute.get('/', authorize(['lender']), loanController.getLoans);

export default loanRoute;
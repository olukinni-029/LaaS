import { Router } from 'express';
import authRoute from './modules/auth/auth.route';
import repayRoute from './modules/repayment/repay.route';
import agentRoute from './modules/agent/agent.route';
import loanRoute from './modules/loan/loan.route';

const rootRouter: Router = Router();

rootRouter.use('/auth',authRoute);
rootRouter.use('/repay',repayRoute);
rootRouter.use('/agent',agentRoute);
rootRouter.use('/loan',loanRoute);

export default rootRouter;
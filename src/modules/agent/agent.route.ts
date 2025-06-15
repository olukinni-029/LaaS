import { Router } from 'express';
import { authorize } from '../../middlewares/authentication';
import { agentController } from './agent.controller';


const agentRoute: Router = Router();

agentRoute.get('/commissions', authorize(['lender']), agentController.getCommissionHistory);

export default agentRoute;
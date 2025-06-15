import { Router } from 'express';
import { schemas, validate } from './AuthDto';
import { authController } from './auth.controller';


const authRoute : Router = Router();

authRoute.post('/register',validate(schemas.signupSchema),authController.createUser);
authRoute.post('/login',validate(schemas.loginSchema),authController.loginUser);
authRoute.post('/refresh-token', authController.refreshAccessToken);

export default authRoute;
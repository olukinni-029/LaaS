import Joi from "joi";
import { Role } from "./user.model";
import { Request, Response, NextFunction } from 'express';

const validate = (schema: Joi.ObjectSchema<object>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');

      const newMessage = message.replace(/"/g, '');
      res.status(422).json({
        status: 'error',
        message: newMessage,
      });
    }
  };
};


const schemas = {

 signupSchema : Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(Role.CUSTOMER, Role.ADMIN, Role.LENDER),
}),

loginSchema : Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}),
}

export { validate, schemas };
import Joi from 'joi';
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
ApplyLoanSchema : Joi.object().keys({
  amount: Joi.number().min(1).max(1000000).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  })
}),
  RepayLoanSchema : Joi.object().keys({
  amount: Joi.number().min(1).max(1000000).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  })
  })

}


export { validate, schemas };
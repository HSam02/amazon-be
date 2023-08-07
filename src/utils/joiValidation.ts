import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const joiValidation = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const validationError = new Error("Validation Error") as Joi.ValidationError;
    validationError.details = error.details;
    return res.status(403).json(validationError);
  }

  next();
};

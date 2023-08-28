import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const joiValidation =
  (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
    let field = req.body;

    if (req.body.data) {
      try {
        field = JSON.parse(req.body.data);
        delete req.body.data;
        req.body = field;
      } catch (error) {
        console.log(error);
      }
    }

    const { error } = schema.validate(field, { abortEarly: false });

    if (error) {
      const validationError = new Error(
        "Validation Error"
      ) as Joi.ValidationError;
      validationError.details = error.details;
      return res.status(403).json(validationError);
    }

    next();
  };

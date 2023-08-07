import Joi from "joi";

export interface IRegisterShcema {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ILoginShcema {
  email: string;
  password: string;
}

export const registerSchema = Joi.object<IRegisterShcema>({
  firstName: Joi.string().min(2).max(15).required(),
  lastName: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
});

export const loginSchema = Joi.object<ILoginShcema>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
});

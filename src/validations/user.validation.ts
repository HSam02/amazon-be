import Joi from "joi";

export interface IRegisterShcema {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verification: { code: string; token: string };
}

export interface ILoginShcema {
  email: string;
  password: string;
}

export interface IChangePasswordSchema {
  oldPassword: string;
  password: string;
}

const passwordSchema = Joi.string()
  .min(8)
  .max(16)
  .regex(/^[A-Za-z\d@$!%*?&]+$/)
  .required();

export const registerSchema = Joi.object<IRegisterShcema>({
  firstName: Joi.string().min(2).max(15).required(),
  lastName: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: passwordSchema,
  verification: Joi.object()
    .required()
    .keys({
      code: Joi.string().length(6).required(),
      token: Joi.string().required(),
    }),
});

export const loginSchema = Joi.object<ILoginShcema>({
  email: Joi.string().email().required(),
  password: passwordSchema,
});

export const changePasswordSchema = Joi.object<IChangePasswordSchema>({
  oldPassword: passwordSchema,
  password: passwordSchema,
});

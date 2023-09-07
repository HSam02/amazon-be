import Joi from "joi";

export interface ICreatePaymentIntentSchema {
  cartItemIds: number[];
  address: string;
}

export const createPaymentIntentSchema = Joi.object<ICreatePaymentIntentSchema>(
  {
    cartItemIds: Joi.array().items(Joi.number().required()).required(),
    address: Joi.string().min(3).max(25).required(),
  }
);

import Joi from "joi";

export interface ICreateOrderSchema {
  productId: number;
  address: string;
  quantity: number;
  price: string;
  color: string;
  size: string;
}

export const createOrderSchema = Joi.array().items(
  Joi.object<ICreateOrderSchema>({
    productId: Joi.number().required(),
    address: Joi.string().min(3).max(25).required(),
    quantity: Joi.number().required(),
    price: Joi.string().min(1).max(15).required(),
    color: Joi.string().min(2).max(10).required(),
    size: Joi.string().min(1).max(10).required(),
  })
);

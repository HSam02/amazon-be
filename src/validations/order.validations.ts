import Joi from "joi";

export interface ICreateOrderSchema {
  address: string;
  products: ICreateOrderProductSchema[];
}

interface ICreateOrderProductSchema {
  productId: number;
  quantity: number;
  price: string;
  color: string;
  size: string;
}

export const createOrderSchema = Joi.object<ICreateOrderSchema>({
  address: Joi.string().min(3).max(25).required(),
  products: Joi.array()
    .items(
      Joi.object<ICreateOrderProductSchema>({
        productId: Joi.number().required(),
        quantity: Joi.number().required(),
        price: Joi.string().min(1).max(15).required(),
        color: Joi.string().min(2).max(10).required(),
        size: Joi.string().min(1).max(10).required(),
      }).required()
    )
    .required(),
});

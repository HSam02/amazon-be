import Joi from "joi";

export interface ICreateCartSchema {
  productId: number;
  sizeId: number;
  colorId: number;
  quantity: number;
}
export interface IUpdateCartSchema {
  sizeId: number;
  colorId: number;
  quantity: number;
}

export const createCartSchema = Joi.object<ICreateCartSchema>({
  productId: Joi.number().required(),
  sizeId: Joi.number().required(),
  colorId: Joi.number().required(),
  quantity: Joi.number().greater(0).required(),
});

export const updateCartSchema = Joi.object({
  quantity: Joi.number().greater(0).optional(),
  sizeId: Joi.number().optional(),
  colorId: Joi.number().optional(),
});

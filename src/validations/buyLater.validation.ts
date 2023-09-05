import Joi from "joi";

export interface ICreateBuyLaterSchema {
  productId: number;
  sizeId: number;
  colorId: number;
}

export const createBuyLaterSchema = Joi.object<ICreateBuyLaterSchema>({
  productId: Joi.number().required(),
  sizeId: Joi.number().required(),
  colorId: Joi.number().required(),
});

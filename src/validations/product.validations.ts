import Joi from "joi";

export interface IProductCreateSchema {
  name: string;
  description?: string;
  brand: string;
  price: string;
  categoryId: number;
  defaultImageId?: number;
  sizeIds: number[];
  colorIds: number[];
  imageIds: number[];
}

export const productCreateSchema = Joi.object<IProductCreateSchema>({
  name: Joi.string().min(3).max(15).required(),
  description: Joi.string().max(150).optional(),
  brand: Joi.string().min(2).max(15).required(),
  price: Joi.string().min(1).max(15).required(),
  categoryId: Joi.number().required(),
  defaultImageId: Joi.number().optional(),
  sizeIds: Joi.array().items(Joi.number().required()).required(),
  colorIds: Joi.array().items(Joi.number().required()).required(),
  imageIds: Joi.array().items(Joi.number().required()).required(),
});

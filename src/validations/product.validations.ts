import Joi from "joi";

export interface IProductCreateSchema {
  name: string;
  description?: string;
  brand: string;
  price: string;
  categoryId: number;
  isAvailable?: boolean;
  sizeIds: number[];
  colorIds: number[];
}

export interface IProductUpdateSchema {
  name?: string;
  description?: string;
  brand?: string;
  price?: string;
  categoryId?: number;
  isAvailable?: boolean;
  defaultImageId: number;
  sizeIds?: number[];
  colorIds?: number[];
  imageIds?: number[];
}

export const productCreateSchema = Joi.object<IProductCreateSchema>({
  name: Joi.string().min(3).max(15).required(),
  description: Joi.string().max(150).optional(),
  brand: Joi.string().min(2).max(15).required(),
  price: Joi.string().min(1).max(15).required(),
  categoryId: Joi.number().required(),
  sizeIds: Joi.array().items(Joi.number().required()).required(),
  colorIds: Joi.array().items(Joi.number().required()).required(),
  isAvailable: Joi.boolean().optional(),
});

export const productUpdateSchema = Joi.object<IProductUpdateSchema>({
  name: Joi.string().min(3).max(15).optional(),
  description: Joi.string().max(150).optional(),
  brand: Joi.string().min(2).max(15).optional(),
  price: Joi.string().min(1).max(15).optional(),
  categoryId: Joi.number().optional(),
  defaultImageId: Joi.number().optional(),
  isAvailable: Joi.boolean().optional(),
  sizeIds: Joi.array().items(Joi.number()).optional(),
  colorIds: Joi.array().items(Joi.number()).optional(),
  imageIds: Joi.array().items(Joi.number()).optional(),
});

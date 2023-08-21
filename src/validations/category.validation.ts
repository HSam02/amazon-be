import Joi from "joi";

export interface ICategoryCreateSchema {
  title: string;
  parentId?: number;
}

export interface ICategoryUpdateSchema {
  title: string;
}

export const categoryUpdateSchema = Joi.object<ICategoryUpdateSchema>({
  title: Joi.string().min(2).max(15).required(),
});

export const categoryCreateSchema = Joi.object<ICategoryCreateSchema>({
  title: Joi.string().min(2).max(15).required(),
  parentId: Joi.number().optional(),
});

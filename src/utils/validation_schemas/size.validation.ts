import Joi from "joi";

export interface ISizeSchema {
  value: string;
}

export const sizeSchema = Joi.object<ISizeSchema>({
  value: Joi.string().min(1).max(10).required(),
});

import Joi from "joi";

export interface IColorSchema {
  value: string;
}

export const colorSchema = Joi.object<IColorSchema>({
  value: Joi.string().min(2).max(10).required(),
});

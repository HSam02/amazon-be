import Joi from "joi";

export interface IAddressSchema {
  value: string;
}

export const addressSchema = Joi.object<IAddressSchema>({
  value: Joi.string().min(3).max(25).required(),
});

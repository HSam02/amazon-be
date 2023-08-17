import { Request, Response } from "express";
import { IColorSchema } from "../validation_schemas/color.validation.js";
import Color from "../models/color.model.js";

export const create = async (req: Request, res: Response) => {
  try {
    const { value } = req.body as IColorSchema;

    const color = await Color.create({ value });
    res.json(color);
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { value } = req.body as IColorSchema;
    const id = req.params.id;

    const color = await Color.update({ value }, { where: { id } });
    res.json(color);
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

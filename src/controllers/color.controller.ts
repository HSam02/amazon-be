import { Request, Response } from "express";
import { IColorSchema } from "../validations/color.validation.js";
import { Color } from "../database/models/models.js";

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

    const [success] = await Color.update({ value }, { where: { id } });

    res.json({
      success: Boolean(success),
    });
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const count = await Color.destroy({ where: { id } });
    res.json({
      success: Boolean(count),
    });
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const colors = await Color.findAll({ order: [["id", "ASC"]] });
    res.json(colors);
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

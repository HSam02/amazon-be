import { Request, Response } from "express";
import { ISizeSchema } from "../utils/validation_schemas/size.validation.js";
import { Size } from "../database/models/models.js";

export const create = async (req: Request, res: Response) => {
  try {
    const { value } = req.body as ISizeSchema;

    const size = await Size.create({ value });
    res.json(size);
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { value } = req.body as ISizeSchema;
    const id = req.params.id;

    const [success] = await Size.update({ value }, { where: { id } });
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
    const count = await Size.destroy({ where: { id } });
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
    const sizes = await Size.findAll();
    res.json(sizes);
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

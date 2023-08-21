import { Request, Response } from "express";
import {
  ICategoryCreateSchema,
  ICategoryUpdateSchema,
} from "../validations/category.validation";
import { Category } from "../database/models/models";
import constructNestedCategories from "../utils/constructNestedCategories";

export const create = async (req: Request, res: Response) => {
  try {
    const { title, parentId } = req.body as ICategoryCreateSchema;
    let reqBody: ICategoryCreateSchema = { title };

    if (parentId !== undefined) {
      const parent = await Category.findByPk(parentId);
      if (parent) {
        reqBody.parentId = parentId;
      } else {
        return res.status(404).json({
          message: "Parent not found",
        });
      }
    }

    const category = await Category.create(reqBody);
    res.json(category);
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { title } = req.body as ICategoryUpdateSchema;
    const [count] = await Category.update({ title }, { where: { id } });
    res.json({
      success: Boolean(count),
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
    const count = await Category.destroy({ where: { id } });
    res.json({
      success: Boolean(count),
    });
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    const nestedCategories = constructNestedCategories(categories);
    res.json(nestedCategories);
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

import { Request, Response } from "express";
import { IProductCreateSchema } from "../validations/product.validations";
import {
  Category,
  Color,
  Product,
  Size,
  User,
} from "../database/models/models";
import db from "../database/models";

export const create = async (req: Request, res: Response) => {
  const t = await db.sequelize.transaction();
  try {
    const { imageIds, sizeIds, colorIds, ...otherData } =
      req.body as IProductCreateSchema;

    const product = await Product.create(
      { ...otherData, userId: req.user!.id },
      { transaction: t }
    );
    await product.addSizes(sizeIds, t);
    await product.addColors(colorIds, t);

    await product.reload({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
        { model: Category, as: "category", attributes: ["title"] },
        { model: Size, as: "sizes" },
        { model: Color, as: "colors" },
      ],
      transaction: t,
    });

    await t.commit();
    res.json(product);
  } catch (error: any) {
    await t.rollback();
    res.status(415).json({
      message: error.message,
    });
  }
};

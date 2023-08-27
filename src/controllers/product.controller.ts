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

    const newProduct = await Product.findByPk(product.id, {
      include: [
        User,
        { model: Category, as: "category" },
        { model: Size, as: "sizes" },
        { model: Color, as: "colors" },
      ],
      // include: { model: Category, as: "category" },
    });

    // const [newProduct] = await Product.getProducts([product.id], t);

    await t.commit();
    res.json(newProduct);
  } catch (error: any) {
    await t.rollback();
    res.status(415).json({
      message: error.message,
    });
  }
};

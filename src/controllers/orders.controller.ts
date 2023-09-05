import { Request, Response } from "express";
import { Transaction } from "sequelize";
import db from "../database/models";
import { ICreateOrderSchema } from "../validations/orders.validations";
import { Order, OrdersProducts, Product } from "../database/models/models";
import { includeAll } from "../utils/product/includes";

export const create = async (req: Request, res: Response) => {
  const transaction: Transaction = await db.sequelize.transaction();
  try {
    const data = req.body as ICreateOrderSchema[];

    const order = await Order.create({ userId: req.user!.id }, { transaction });

    await OrdersProducts.bulkCreate(
      data.map((item) => ({
        ...item,
        orderId: order.id,
      })),
      { transaction }
    );

    await order.reload({
      include: {
        model: Product,
        include: includeAll,
        through: { attributes: [] },
      },
    });

    await transaction.commit();
    res.json(order);
  } catch (error) {
    await transaction.rollback();
    console.log("Order create Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

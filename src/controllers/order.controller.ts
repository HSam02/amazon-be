import { Request, Response } from "express";
import { Transaction } from "sequelize";
import db from "../database/models";
import { ICreateOrderSchema } from "../validations/order.validations";
import { Order, OrdersProducts, Product } from "../database/models/models";
import { includeAll } from "../utils/product/includes";
import getOrdersData from "../utils/order/getOrdersData";

export const create = async (req: Request, res: Response) => {
  const transaction: Transaction = await db.sequelize.transaction();
  try {
    const { address, products } = req.body as ICreateOrderSchema;

    const order = await Order.create(
      { userId: req.user!.id, address },
      { transaction }
    );

    await OrdersProducts.bulkCreate(
      products.map((item) => ({
        ...item,
        orderId: order.id,
      })),
      { transaction }
    );

    await order.reload({
      include: {
        model: Product,
        include: includeAll,
        as: "products",
      },
      transaction,
    });

    await transaction.commit();
    res.json({ ...getOrdersData([order])[0] });
  } catch (error) {
    await transaction.rollback();
    console.log("Order create Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const { rows, count } = await Order.findAndCountAll({
      where: {
        userId: req.user?.id,
      },
      include: {
        model: Product,
        include: includeAll,
        as: "products",
      },
      limit: +limit,
      offset: (+page - 1) * +limit,
      distinct: true,
      order: [["id", "DESC"]],
    });

    const orders = getOrdersData(rows);

    res.json({
      orders,
      pagination: { count, page: +page, limit: +limit },
    });
  } catch (error) {
    console.log("Order getALl Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

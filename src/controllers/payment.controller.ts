import { Request, Response } from "express";
import { Transaction } from "sequelize";
import stripe from "../services/stripe";
import { ICreatePaymentIntentSchema } from "../validations/payment.validations";
import {
  Cart,
  Color,
  Order,
  OrdersProducts,
  Product,
  Size,
} from "../database/models/models";
import { includeAll } from "../utils/product/includes";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import db from "../database/models";
import { ICreateOrderSchema } from "../validations/order.validations";

export const create = async (req: Request, res: Response) => {
  try {
    const { cartItemIds, address } = req.body as ICreatePaymentIntentSchema;
    const cartItems = await Cart.findAll({
      where: { id: cartItemIds, userId: req.user?.id },
      include: {
        model: Product,
        as: "product",
        include: includeAll,
      },
    });

    const amount = cartItems.reduce(
      (acc, item) => acc + item.quantity + +item.product.price,
      0
    );

    const token = jwt.sign(
      {
        cartItemIds,
        address,
      },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "1h",
      }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      description: "Payment",
      metadata: {
        token,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log("Error creating PaymentIntent:", error);
    res.status(500).json({ error: "Could not create PaymentIntent" });
  }
};

export const webhook = async (req: Request, res: Response) => {
  const transaction: Transaction = await db.sequelize.transaction();
  try {
    if (req.body.type === "payment_intent.succeeded") {
      const token = req.body.data.object.metadata.token as string;
      const { cartItemIds, address } = (<jwt.JwtPayload>(
        jwt.verify(token, process.env.JWT_SECRET || "")
      )) as { cartItemIds: number[]; address: string };

      const cartItems = await Cart.findAll({
        where: { id: cartItemIds },
        include: [
          {
            model: Product,
            as: "product",
            include: includeAll,
          },
          {
            model: Size,
            as: "size",
          },
          {
            model: Color,
            as: "color",
          },
        ],
      });

      const order = await Order.create(
        { userId: cartItems[0].userId, address },
        { transaction }
      );

      await OrdersProducts.bulkCreate(
        cartItems.map((item) => ({
          orderId: order.id,
          productId: item.product.id,
          color: item.color.value,
          size: item.size.value,
          price: item.product.price,
          quantity: item.quantity,
        })),
        { transaction }
      );

      await Cart.destroy({
        where: { id: cartItems.map(({ id }) => id) },
        transaction,
      });

      await transaction.commit();
    }
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    console.log("Error handling webhook event:", error);
    res.sendStatus(400);
  }
};

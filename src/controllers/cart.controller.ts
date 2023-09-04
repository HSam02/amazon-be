import { Request, Response } from "express";
import { Cart, Color, Product, Size } from "../database/models/models";
import {
  ICreateCartSchema,
  IUpdateCartSchema,
} from "../validations/cart.validation";
import { includeAll } from "../utils/product/includes";

export const create = async (req: Request, res: Response) => {
  try {
    const { quantity, ...otherData } = req.body as ICreateCartSchema;
    const item = await Cart.findOne({ where: otherData });
    if (item) {
      return res.status(409).json({
        message: "Item already exists in the Cart",
      });
    }

    const cartItem = await Cart.create(
      {
        ...(req.body as ICreateCartSchema),
        userId: req.user!.id,
      },
      {
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
      }
    );
    res.json(cartItem);
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const cartItem = await Cart.findByPk(id, {
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

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "The Cart Item not found",
      });
    }

    if (cartItem.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "No Access!",
      });
    }

    await cartItem.update(req.body as IUpdateCartSchema);

    res.json({
      success: true,
      cartItem,
    });
  } catch (error: any) {
    res.status(415).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "The Cart Item not found",
      });
    }

    if (cartItem.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "No Access!",
      });
    }
    await cartItem.destroy();
    res.json({
      success: true,
    });
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const getMy = async (req: Request, res: Response) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user?.id },
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
    res.json(cartItems);
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

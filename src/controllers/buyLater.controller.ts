import { Request, Response } from "express";
import { ICreateBuyLaterSchema } from "../validations/buyLater.validation";
import { BuyLater, Color, Product, Size } from "../database/models/models";
import { includeAll } from "../utils/product/includes";

export const create = async (req: Request, res: Response) => {
  try {
    const data = req.body as ICreateBuyLaterSchema;
    const item = await BuyLater.findOne({ where: { ...data } });
    if (item) {
      return res.status(409).json({
        message: "Item already exists",
      });
    }

    const buyLaterItem = await BuyLater.create(
      {
        ...data,
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
    res.json(buyLaterItem);
  } catch (error) {
    console.log("BuyLater create Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const buyLaterItem = await BuyLater.findByPk(id);
    if (!buyLaterItem) {
      return res.status(404).json({
        success: false,
        message: "The Item not found",
      });
    }

    if (buyLaterItem.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "No Access!",
      });
    }
    await buyLaterItem.destroy();
    res.json({
      success: true,
    });
  } catch (error) {
    console.log("BuyLater remove Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMy = async (req: Request, res: Response) => {
  try {
    const buyLaterItems = await BuyLater.findAll({
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
    res.json(buyLaterItems);
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

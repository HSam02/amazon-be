import { Request, Response } from "express";
import { IAddressSchema } from "../validations/address.validations";
import { Address } from "../database/models/models";

export const create = async (req: Request, res: Response) => {
  try {
    const { value } = req.body as IAddressSchema;
    const address = await Address.create({ value, userId: req.user!.id });
    res.json({
      id: address.id,
      value: address.value,
    });
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { value } = req.body as IAddressSchema;

    const address = await Address.findByPk(id);
    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (req.user?.id !== address.userId) {
      return res.status(403).json({
        message: "No Access!",
      });
    }

    address.value = value;
    const newAddress = await address.save();
    res.json({
      id: newAddress.id,
      value: newAddress.value,
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

    const address = await Address.findByPk(id);
    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (req.user?.id !== address.userId) {
      return res.status(403).json({
        message: "No Access!",
      });
    }

    await address.destroy();
    res.json({
      success: true,
    });
  } catch (error: any) {
    res.status(415).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.user?.id },
    });
    res.json(
      addresses.map((address) => ({
        id: address.id,
        value: address.value,
      }))
    );
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

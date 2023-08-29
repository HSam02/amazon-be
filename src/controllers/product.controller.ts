import { Request, Response } from "express";
import { Transaction } from "sequelize";
import fs from "fs";
import db from "../database/models";
import { Product, Image } from "../database/models/models";
import {
  IProductCreateSchema,
  IProductUpdateSchema,
} from "../validations/product.validations";
import updateSizesOrColors from "../utils/product/updateSizesOrColors";
import {
  includeAll,
  includeImages,
  includeSizesColors,
} from "../utils/product/includes";

export const create = async (req: Request, res: Response) => {
  const transaction: Transaction = await db.sequelize.transaction();
  try {
    const { sizeIds, colorIds, ...otherData } =
      req.body as IProductCreateSchema;
    const files = req.files as Express.Multer.File[];

    const product = await Product.create(
      { ...otherData, userId: req.user!.id },
      { transaction }
    );
    await product.addSizes(sizeIds, transaction);
    await product.addColors(colorIds, transaction);

    const fileDests = files.map((file) => ({
      url: file.destination.slice(5) + "/" + file.filename,
      productId: product.id,
    }));

    const images = await Image.bulkCreate(fileDests, { transaction });

    product.defaultImageId = images[0].id;

    await product.save({
      transaction,
    });

    await product.reload({
      include: includeAll,
      transaction,
    });

    await transaction.commit();
    const { userId, categoryId, defaultImageId, ...resData } =
      product.dataValues;
    res.json(resData);
  } catch (error: any) {
    await transaction.rollback();
    res.status(415).json({
      message: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  const transaction: Transaction = await db.sequelize.transaction();
  try {
    const id = req.params.id;
    const { sizeIds, colorIds, imageIds, ...updateData } =
      req.body as IProductUpdateSchema;
    const files = req.files as Express.Multer.File[];

    const product = await Product.findByPk(id, {
      include: [includeImages, ...includeSizesColors],
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.userId !== req.user?.id) {
      return res.status(403).json({
        message: "No Access!",
      });
    }

    if (imageIds) {
      const oldImageIds: number[] = product.images.map(
        ({ id }: { id: number }) => id
      );

      const removingImageIds = oldImageIds.filter(
        (oldImageId) => !imageIds.includes(oldImageId)
      );
      if (removingImageIds.length) {
        await Image.destroy({ where: { id: removingImageIds }, transaction });
        product.images.forEach(
          ({ id, url }: { id: number; url: string }) =>
            removingImageIds.includes(id) &&
            fs.existsSync(`./src${url}`) &&
            fs.unlinkSync(`./src${url}`)
        );
      }
    }

    if (files?.length) {
      const fileDests = files.map((file) => ({
        url: file.destination.slice(5) + "/" + file.filename,
        productId: product.id,
      }));

      const images = await Image.bulkCreate(fileDests, { transaction });

      updateData.defaultImageId = updateData.defaultImageId || images[0].id;
    }

    await product.update(updateData, { transaction });

    if (sizeIds) {
      const oldSizeIds: number[] = product.sizes.map(
        ({ id }: { id: number }) => id
      );
      await updateSizesOrColors(
        oldSizeIds,
        sizeIds,
        transaction,
        product.removeSizes,
        product.addSizes
      );
    }

    if (colorIds) {
      const oldColorIds: number[] = product.colors.map(
        ({ id }: { id: number }) => id
      );
      await updateSizesOrColors(
        oldColorIds,
        colorIds,
        transaction,
        product.removeColors,
        product.addColors
      );
    }

    await transaction.commit();

    product.reload({ include: includeAll });
    res.json({ success: true, product });
  } catch (error: any) {
    await transaction.rollback();
    res.status(415).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const product = await Product.findByPk(id, {
      include: includeImages,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.userId !== req.user?.id) {
      return res.status(403).json({
        message: "No Access!",
      });
    }

    await product.destroy();

    const images = product.images;

    images.forEach(
      ({ url }: { url: string }) =>
        fs.existsSync(`./src${url}`) && fs.unlinkSync(`./src${url}`)
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(415).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const { rows, count } = await Product.findAndCountAll({
      where: { userId: req.user?.id },
      include: includeAll,
      limit: +limit,
      offset: (+page - 1) * +limit,
      distinct: true,
    });

    const products = rows.map((product) => {
      const { userId, categoryId, defaultImageId, ...resData } =
        product.dataValues;

      return resData;
    });

    res.json({ products, pagination: { count, page } });
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

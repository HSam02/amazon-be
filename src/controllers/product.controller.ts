import { Request, Response } from "express";
import { Transaction, Op, QueryTypes } from "sequelize";
import fs from "fs";
import db from "../database/models";
import {
  Product,
  Image,
  Order,
  OrdersProducts,
} from "../database/models/models";
import {
  IProductCreateSchema,
  IProductUpdateSchema,
} from "../validations/product.validations";
import updateSizesOrColors from "../utils/product/updateSizesOrColors";
import {
  includeAll,
  includeDefaultImage,
  includeImages,
  includeSizesColors,
} from "../utils/product/includes";

export const create = async (req: Request, res: Response) => {
  const transaction: Transaction = await db.sequelize.transaction();
  const reqFiles = req.files as {
    [key: string]: Express.Multer.File[] | undefined;
  };
  const file =
    reqFiles?.default && reqFiles.default.length > 0
      ? reqFiles.default[0]
      : undefined;
  const files = reqFiles?.media;
  try {
    const { sizeIds, colorIds, ...otherData } =
      req.body as IProductCreateSchema;

    const product = await Product.create(
      { ...otherData, userId: req.user!.id },
      { transaction }
    );
    await product.addSizes(sizeIds, transaction);
    await product.addColors(colorIds, transaction);

    const fileDests =
      files?.map((file) => ({
        url: file.destination.slice(5) + "/" + file.filename,
        productId: product.id,
      })) || [];

    if (file) {
      fileDests.unshift({
        url: file.destination.slice(5) + "/" + file.filename,
        productId: product.id,
      });
    }

    const images = await Image.bulkCreate(fileDests, { transaction });

    if (file) {
      product.defaultImageId = images[0].id;
    }

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
    res.json({
      ...resData,
      images: product.images.filter(
        ({ id }: { id: number }) => id !== product.defaultImageId
      ),
    });
  } catch (error: any) {
    await transaction.rollback();
    files?.forEach(
      ({ destination, filename }) =>
        fs.existsSync(destination + filename) &&
        fs.unlinkSync(destination + filename)
    );
    if (file && fs.existsSync(file.destination + file.filename)) {
      fs.unlinkSync(file.destination + file.filename);
    }
    res.status(415).json({
      message: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  const transaction: Transaction = await db.sequelize.transaction();
  const reqFiles = req.files as {
    [key: string]: Express.Multer.File[] | undefined;
  };
  const file =
    reqFiles?.default && reqFiles.default.length > 0
      ? reqFiles.default[0]
      : undefined;
  const files = reqFiles?.media;
  try {
    const id = req.params.id;
    const { sizeIds, colorIds, imageIds, ...updateData } =
      req.body as IProductUpdateSchema;

    const product = await Product.findByPk(id, {
      include: [includeDefaultImage, includeImages, ...includeSizesColors],
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
        (oldImageId) =>
          !imageIds.includes(oldImageId) &&
          oldImageId !== product.defaultImageId
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

    const fileDests =
      files?.map((file) => ({
        url: file.destination.slice(5) + "/" + file.filename,
        productId: product.id,
      })) || [];

    if (file) {
      fileDests.unshift({
        url: file.destination.slice(5) + "/" + file.filename,
        productId: product.id,
      });
    }

    if (fileDests.length) {
      const images = await Image.bulkCreate(fileDests, { transaction });

      if (file) {
        updateData.defaultImageId = images[0].id;
      }
    }

    if (sizeIds) {
      const oldSizeIds: number[] = product.sizes.map(
        ({ id }: { id: number }) => id
      );
      await updateSizesOrColors(
        oldSizeIds,
        sizeIds,
        transaction,
        product.removeSizes.bind(product),
        product.addSizes.bind(product)
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
        product.removeColors.bind(product),
        product.addColors.bind(product)
      );
    }

    if (
      file &&
      product.defaultImg &&
      fs.existsSync("./src" + product.defaultImg.url)
    ) {
      fs.unlinkSync("./src" + product.defaultImage.url);
    }

    await product.update(updateData, { transaction });

    await transaction.commit();

    await product.reload({ include: includeAll });
    const images = product.images.filter(
      ({ id }: { id: number }) => id !== product.defaultImageId
    );
    res.json({ success: true, product: { ...product.dataValues, images } });
  } catch (error: any) {
    await transaction.rollback();
    files?.forEach(
      ({ destination, filename }) =>
        fs.existsSync(destination + filename) &&
        fs.unlinkSync(destination + filename)
    );
    if (file && fs.existsSync(file.destination + file.filename)) {
      fs.unlinkSync(file.destination + file.filename);
    }
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

    product.deletedAt = new Date();
    await product.save();

    // await product.destroy();

    // product.images.forEach(
    //   ({ url }: { url: string }) =>
    //     fs.existsSync(`./src${url}`) && fs.unlinkSync(`./src${url}`)
    // );

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
      where: { userId: req.user?.id, deletedAt: null },
      include: includeAll,
      limit: +limit,
      offset: (+page - 1) * +limit,
      distinct: true,
      order: [["id", "DESC"]],
    });

    const products = rows.map((product) => {
      const images = product.images.filter(
        ({ id }: { id: number }) => id !== product.defaultImageId
      );
      const { userId, categoryId, defaultImageId, ...resData } =
        product.dataValues;

      return { ...resData, images };
    });

    const ordersProducts = await OrdersProducts.findAll({
      where: { productId: products.map(({ id }) => id) },
      include: {
        model: Product,
        include: includeAll,
        as: "product",
      },
    });

    const productsWithStatistic = products.map((product) => ({
      ...product,
      statistic: ordersProducts.reduce(
        (acc, { productId, price, quantity }) =>
          productId === product.id
            ? {
                totalCount: acc.totalCount + quantity,
                totalPrice: acc.totalPrice + quantity * +price,
              }
            : acc,
        {
          totalCount: 0,
          totalPrice: 0,
        }
      ),
    }));

    res.json({
      products: productsWithStatistic,
      pagination: { count, page: +page, limit: +limit },
    });
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const {
      limit = 10,
      page = 1,
      ...filters
    } = req.query as Partial<
      Omit<IProductCreateSchema, "isAvailable" | "description" | "price"> & {
        limit: number;
        page: number;
      }
    >;

    const { brand, name, categoryId, colorIds, sizeIds } = filters;

    const query = `
    SELECT p.id
    FROM Products p
    WHERE p.userId != ${req.user?.id || 0}
    AND ISNULL(p.deletedAt)
    AND p.isAvailable = 1
    ${name ? ` AND LOWER(p.name) LIKE LOWER('%${name}%')` : ""}
    ${brand ? `AND LOWER(p.brand) LIKE LOWER('%${brand}%')` : ""}
    ${categoryId ? `AND p.categoryId = ${categoryId}` : ""}
    ${
      colorIds?.length
        ? `AND p.id IN (
      SELECT pc.ProductId
      FROM ProductColors pc
      WHERE pc.ColorId IN (${colorIds?.join(",")})
      GROUP BY pc.ProductId
      HAVING COUNT(DISTINCT pc.ColorId) = ${colorIds?.length}
    )`
        : ""
    }
    ${
      sizeIds?.length
        ? `AND p.id IN (
      SELECT ps.ProductId
      FROM ProductSizes ps
      WHERE ps.SizeId IN (${sizeIds?.join(",")})
      GROUP BY ps.ProductId
      HAVING COUNT(DISTINCT ps.SizeId) = ${sizeIds?.length}
    )`
        : ""
    }
  `;

    const productIds: { id: number }[] = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    const rows = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds.map(({ id }) => id),
        },
      },
      include: includeAll,
      order: [["id", "DESC"]],
      limit: +limit,
      offset: (+page - 1) * +limit,
    });

    const products = rows.map((product) => {
      const images = product.images.filter(
        ({ id }: { id: number }) => id !== product.defaultImageId
      );
      const { userId, categoryId, defaultImageId, ...resData } =
        product.dataValues;

      return { ...resData, images };
    });

    res.json({
      products,
      pagination: {
        count: productIds.length,
        page: +page,
        limit: +limit,
      },
    });
  } catch (error: any) {
    console.log("Error getAll", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

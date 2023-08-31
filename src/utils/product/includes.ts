import { Includeable, Op } from "sequelize";
import {
  Category,
  Color,
  Image,
  Size,
  User,
} from "../../database/models/models";

export const includeImages: Includeable = {
  model: Image,
  as: "images",
  attributes: { exclude: ["productId"] },
};

export const includeSizesColors: Includeable[] = [
  { model: Size, as: "sizes", through: { attributes: [] } },
  { model: Color, as: "colors", through: { attributes: [] } },
];

export const includeDefaultImage: Includeable = {
  model: Image,
  as: "defaultImg",
  attributes: { exclude: ["productId"] },
};

export const includeAll: Includeable[] = [
  {
    model: User,
    as: "user",
    attributes: ["id", "firstName", "lastName"],
  },
  { model: Category, as: "category", attributes: { exclude: ["parentId"] } },
  includeDefaultImage,
  includeImages,
  ...includeSizesColors,
];

export const filterInclude = (
  colorIds?: number[],
  sizeIds?: number[]
): Includeable[] => {
  const sizeThrough: any = { attributes: [] };
  const colorThrough: any = { attributes: [] };
  if (sizeIds) {
    sizeThrough.where = { [Op.and]: { sizeId: { [Op.in]: sizeIds } } };
  }
  if (colorIds) {
    colorThrough.where = { colorId: { [Op.and]: { [Op.in]: colorIds } } };
  }
  return [
    {
      model: Color,
      through: {
        attributes: [],
      },
      where: { id: { [Op.in]: colorIds } },
      required: true,
      as: "colors",
    },
    {
      model: Size,
      through: sizeThrough,
      required: true,
      as: "sizes",
      // where: { id: { [Op.in]: sizeIds } },
    },
  ];
};

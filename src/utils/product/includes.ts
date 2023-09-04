import { Includeable } from "sequelize";
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

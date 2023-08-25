import { DataTypes } from "sequelize";
import db from "./";
import userModelFunction from "./user";
import sizeModelFunction from "./size";
import colorModelFunction from "./color";
import categoryModelFunction from "./category";
import addressModelFunction from "./address";
import productModelFunction from "./product";
import imageModelFunction from "./image";

export const User = userModelFunction(db.sequelize, DataTypes);
export const Color = colorModelFunction(db.sequelize, DataTypes);
export const Size = sizeModelFunction(db.sequelize, DataTypes);
export const Category = categoryModelFunction(db.sequelize, DataTypes);
export const Address = addressModelFunction(db.sequelize, DataTypes);
export const Product = productModelFunction(db.sequelize, DataTypes);
export const Image = imageModelFunction(db.sequelize, DataTypes);

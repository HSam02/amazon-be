import { DataTypes } from "sequelize";
import db from "./";
import userModelFunction from "./user.js";
import sizeModelFunction from "./size.js";
import colorModelFunction from "./color.js";
import categoryModelFunction from "./category";

export const User = userModelFunction(db.sequelize, DataTypes);
export const Color = colorModelFunction(db.sequelize, DataTypes);
export const Size = sizeModelFunction(db.sequelize, DataTypes);
export const Category = categoryModelFunction(db.sequelize, DataTypes);

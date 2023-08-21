import { DataTypes } from "sequelize";
import db from "./";
import userModelFunction from "./user";
import sizeModelFunction from "./size";
import colorModelFunction from "./color";
import categoryModelFunction from "./category";

export const User = userModelFunction(db.sequelize, DataTypes);
export const Color = colorModelFunction(db.sequelize, DataTypes);
export const Size = sizeModelFunction(db.sequelize, DataTypes);
export const Category = categoryModelFunction(db.sequelize, DataTypes);

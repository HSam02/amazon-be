import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class Category extends Model {
  public id!: number;
  public title!: string;
  public parent!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
  },
);

export default Category;

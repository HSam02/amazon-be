import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class Color extends Model {
  public id!: number;
  public value!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Color.init(
  {
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Color",
  },
);

export default Color;

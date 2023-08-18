import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class Size extends Model {
  public id!: number;
  public value!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Size.init(
  {
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Size",
  },
);

export default Size;

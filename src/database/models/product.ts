"use strict";
import { Model } from "sequelize";

interface IProductAttributes {
  name: string;
  description?: string;
  brand: string;
  price: string;
  categoryId: number | null;
  defaultImageId: number | null;
  isAvailable: boolean;
}

export default (sequelize: any, DataTypes: any) => {
  class Product
    extends Model<IProductAttributes & { id: number }, IProductAttributes>
    implements IProductAttributes
  {
    name!: string;
    description?: string;
    brand!: string;
    price!: string;
    categoryId!: number | null;
    defaultImageId!: number | null;
    isAvailable!: boolean;

    static associate(models: any) {
      Product.belongsToMany(models.Size, { through: "ProductSizes" });
      Product.belongsToMany(models.Color, { through: "ProductColors" });
      Product.belongsToMany(models.Image, { through: "ProductImages" });
      Product.belongsTo(models.Category, { foreignKey: "CategoryId" });
      Product.belongsTo(models.Image, { foreignKey: "defaultImageId" });
    }
  }
  Product.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: { allowNull: false, type: DataTypes.STRING },
      description: { allowNull: true, type: DataTypes.STRING },
      brand: { allowNull: false, type: DataTypes.STRING },
      price: { allowNull: false, type: DataTypes.STRING },
      isAvailable: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      categoryId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Categories",
        },
      },
      defaultImageId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Images",
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};

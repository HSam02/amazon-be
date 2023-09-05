"use strict";
import { Model } from "sequelize";

interface ICartAttributes {
  userId: number;
  sizeId: number;
  colorId: number;
  quantity: number;
  productId: number;
}

export default (sequelize: any, DataTypes: any) => {
  class Cart
    extends Model<ICartAttributes & { id: number }, ICartAttributes>
    implements ICartAttributes
  {
    id!: number;
    userId!: number;
    sizeId!: number;
    colorId!: number;
    quantity!: number;
    productId!: number;
    static associate(models: any) {
      Cart.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
      Cart.belongsTo(models.Color, {
        foreignKey: "colorId",
        as: "color",
        onDelete: "CASCADE",
      });
      Cart.belongsTo(models.Size, {
        foreignKey: "sizeId",
        as: "size",
        onDelete: "CASCADE",
      });
      Cart.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
        onDelete: "CASCADE",
      });
    }
  }
  Cart.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Users",
        },
      },
      productId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Products",
        },
      },
      sizeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Sizes",
        },
      },
      colorId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Colors",
        },
      },
      quantity: {
        defaultValue: 1,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};

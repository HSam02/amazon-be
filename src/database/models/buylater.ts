"use strict";
import { Model } from "sequelize";

interface IBuyLaterAttributes {
  userId: number;
  sizeId: number;
  colorId: number;
  productId: number;
}

export default (sequelize: any, DataTypes: any) => {
  class BuyLater
    extends Model<IBuyLaterAttributes & { id: number }, IBuyLaterAttributes>
    implements IBuyLaterAttributes
  {
    id!: number;
    userId!: number;
    sizeId!: number;
    colorId!: number;
    productId!: number;

    static associate(models: any) {
      BuyLater.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      BuyLater.belongsTo(models.Color, {
        foreignKey: "colorId",
        as: "color",
      });
      BuyLater.belongsTo(models.Size, {
        foreignKey: "sizeId",
        as: "size",
      });
      BuyLater.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  BuyLater.init(
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
    },
    {
      sequelize,
      modelName: "BuyLater",
    }
  );
  return BuyLater;
};

"use strict";
import { Model } from "sequelize";

interface IOrdersProductsAttributes {
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  color: string;
  size: string;
}

export default (sequelize: any, DataTypes: any) => {
  class OrdersProducts
    extends Model<
      IOrdersProductsAttributes & { id: number },
      IOrdersProductsAttributes
    >
    implements IOrdersProductsAttributes
  {
    id!: number;
    orderId!: number;
    productId!: number;
    quantity!: number;
    price!: string;
    color!: string;
    size!: string;

    static associate(models: any) {
      // define association here
    }
  }
  OrdersProducts.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      orderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Orders",
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
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      price: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: { isInt: true },
      },
      color: { allowNull: false, type: DataTypes.STRING },
      size: { allowNull: false, type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "OrdersProducts",
      timestamps: false,
    }
  );
  return OrdersProducts;
};

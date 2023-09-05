"use strict";
import { Model } from "sequelize";

interface IOrderAttributes {
  userId: number;
}

export default (sequelize: any, DataTypes: any) => {
  class Order
    extends Model<IOrderAttributes & { id: number }, IOrderAttributes>
    implements IOrderAttributes
  {
    id!: number;
    userId!: number;
    static associate(models: any) {
      Order.belongsToMany(models.Product, {
        through: "OrdersProducts",
        timestamps: false,
        onDelete: "CASCADE",
        foreignKey: "orderId",
        as: "products",
      });
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Order.init(
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
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};

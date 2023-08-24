"use strict";
import { Model } from "sequelize";
import { User } from "./models";

interface IAddressAttributes {
  value: string;
  userId: number;
}

export default (sequelize: any, DataTypes: any) => {
  class Address
    extends Model<IAddressAttributes & { id: number }, IAddressAttributes>
    implements IAddressAttributes
  {
    id!: number;
    value!: string;
    userId!: number;
    static associate(models: any) {
      Address.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Address.belongsTo(models.User, {
        foreignKey: "defaultAddressId",
      });
    }
  }
  Address.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      value: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      userId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Users",
        },
      },
    },
    {
      sequelize,
      modelName: "Address",
      hooks: {
        async beforeDestroy(instance) {
          const user = await User.findByPk(instance.userId);
          if (user?.defaultAddressId === instance.id) {
            user.defaultAddressId = null;
            await user.save();
          }
        },
      },
    }
  );
  return Address;
};

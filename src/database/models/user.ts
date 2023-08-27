import { Model } from "sequelize";
import * as models from "./models";

interface IUserAttributes {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  defaultAddressId: number | null;
}

export default (sequelize: any, DataTypes: any) => {
  class User
    extends Model<
      IUserAttributes & { id: number; defaultAddressId: number | null },
      IUserAttributes
    >
    implements IUserAttributes
  {
    id!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    passwordHash!: string;
    defaultAddressId!: number | null;

    createdAt!: Date;
    updatedAt!: Date;
    static associate(models: any) {
      User.hasMany(models.Address, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.belongsTo(models.Address, {
        foreignKey: "defaultAddressId",
      });
      User.hasMany(models.Product, {
        sourceKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: { allowNull: false, type: DataTypes.STRING },
      lastName: { allowNull: false, type: DataTypes.STRING },
      email: { allowNull: false, unique: "email", type: DataTypes.STRING },
      passwordHash: { allowNull: false, type: DataTypes.STRING },
      defaultAddressId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Addresses",
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};

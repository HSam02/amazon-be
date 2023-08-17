import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

// interface UserAttributes {
//   firstName: string;
//   lastName: string;
//   email: string;
//   passwordHash?: string;
// }

// class User extends Model<UserAttributes> implements UserAttributes {
class User extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public passwordHash?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  },
);

export default User;

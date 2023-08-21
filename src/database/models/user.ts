import { Model } from "sequelize";
interface IUserAttributes {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

export default (sequelize: any, DataTypes: any) => {
  class User
    extends Model<IUserAttributes & { id: number }, IUserAttributes>
    implements IUserAttributes
  {
    id!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    passwordHash!: string;

    createdAt!: Date;
    updatedAt!: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
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
      email: { allowNull: false, unique: true, type: DataTypes.STRING },
      passwordHash: { allowNull: false, type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

import { Model } from "sequelize";

interface ISizeAttributes {
  value: string;
}

export default (sequelize: any, DataTypes: any) => {
  class Size
    extends Model<ISizeAttributes & { id: number }, ISizeAttributes>
    implements ISizeAttributes
  {
    id!: number;
    value!: string;
    static associate(models: any) {
      // define association here
    }
  }
  Size.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      value: { allowNull: false, unique: true, type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "Size",
      timestamps: false,
    }
  );
  return Size;
};

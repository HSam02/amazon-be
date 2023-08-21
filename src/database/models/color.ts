import { Model } from "sequelize";

interface IColorAttributes {
  value: string;
}

export default (sequelize: any, DataTypes: any) => {
  class Color
    extends Model<IColorAttributes & { id: number }, IColorAttributes>
    implements IColorAttributes
  {
    id!: number;
    value!: string;
    static associate(models: any) {
      // define association here
    }
  }
  Color.init(
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
      modelName: "Color",
      timestamps: false,
    }
  );
  return Color;
};

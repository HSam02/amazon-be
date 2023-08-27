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
      Size.belongsToMany(models.Product, {
        through: "ProductSizes",
        timestamps: false,
        onDelete: "CASCADE",
        foreignKey: "sizeId",
      });
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
      value: { allowNull: false, unique: "value", type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "Size",
      timestamps: false,
    }
  );
  return Size;
};

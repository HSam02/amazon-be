import { Model } from "sequelize";

interface ICategoryAttributes {
  title: string;
  subCategories: string[];
}

export default (sequelize: any, DataTypes: any) => {
  class Category
    extends Model<ICategoryAttributes & { id: number }, ICategoryAttributes>
    implements ICategoryAttributes
  {
    id!: number;
    title!: string;
    subCategories!: string[];
    static associate(models: any) {
      // define association here
    }
  }
  Category.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      subCategories: {
        defaultValue: [],
        type: DataTypes.JSON,
      },
    },
    {
      sequelize,
      modelName: "Category",
      timestamps: false,
    }
  );
  return Category;
};

import { Model } from "sequelize";
import { Product } from "./models";

interface ICategoryAttributes {
  title: string;
  parentId?: number;
}

export default (sequelize: any, DataTypes: any) => {
  class Category
    extends Model<ICategoryAttributes & { id: number }, ICategoryAttributes>
    implements ICategoryAttributes
  {
    id!: number;
    title!: string;
    parentId?: number;
    static associate(models: any) {
      Category.belongsTo(models.Category, {
        as: "parent",
        foreignKey: "parentId",
        onDelete: "CASCADE",
      });
      Category.hasOne(models.Category, {
        as: "children",
        foreignKey: "parentId",
        onDelete: "CASCADE",
      });
      Category.hasMany(models.Product, {
        foreignKey: "categoryId",
      });
      // Category.belongsTo(models.Product, {
      //   foreignKey: "categoryId",
      // });
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
        unique: "title",
        type: DataTypes.STRING,
      },
      parentId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Categories",
        },
      },
    },
    {
      sequelize,
      modelName: "Category",
      timestamps: false,
      hooks: {
        async beforeDestroy(instance) {
          const product = await Product.findOne({
            where: { categoryId: instance.id },
          });
          if (product) {
            product.categoryId = null;
            await product.save();
          }
        },
      },
    }
  );
  return Category;
};

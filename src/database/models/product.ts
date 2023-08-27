"use strict";
import { Model } from "sequelize";

interface IProductAttributes {
  name: string;
  description?: string;
  brand: string;
  price: string;
  userId: number;
  categoryId: number | null;
  defaultImageId: number | null;
  isAvailable?: boolean;
}

export default (sequelize: any, DataTypes: any) => {
  class Product
    extends Model<IProductAttributes & { id: number }, IProductAttributes>
    implements IProductAttributes
  {
    id!: number;
    name!: string;
    description?: string;
    brand!: string;
    price!: string;
    userId!: number;
    categoryId!: number | null;
    defaultImageId!: number | null;
    isAvailable?: boolean;

    static associate(models: any) {
      Product.belongsToMany(models.Size, {
        through: "ProductSizes",
        timestamps: false,
        onDelete: "CASCADE",
      });
      Product.belongsToMany(models.Color, {
        through: "ProductColors",
        timestamps: false,
        onDelete: "CASCADE",
      });
      Product.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Product.belongsTo(models.Category, { foreignKey: "categoryId" });
      Product.hasOne(models.Image, { foreignKey: "defaultImageId" });
      Product.hasMany(models.Image, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
    }

    public async addSizes(sizeIds: number[], transaction: any) {
      try {
        const records = sizeIds.map((sizeId) => ({
          productId: this.id,
          sizeId,
        }));
        await sequelize.query(
          `INSERT INTO ProductSizes (productId, sizeId) VALUES ${records
            .map(({ productId, sizeId }) => `(${productId}, ${sizeId})`)
            .join(", ")}`,
          {
            transaction,
          }
        );
      } catch (error) {
        throw error;
      }
    }

    public async addColors(colorIds: number[], transaction: any) {
      try {
        const records = colorIds.map((colorId) => ({
          productId: this.id,
          colorId,
        }));
        await sequelize.query(
          `INSERT INTO ProductColors (productId, colorId) VALUES ${records
            .map(({ colorId, productId }) => `(${productId}, ${colorId})`)
            .join(", ")}`,
          {
            transaction,
          }
        );
      } catch (error) {
        throw error;
      }
    }

    // static async getProducts(productIds: number[], transaction: any) {
    //   try {
    //     const products = await Product.findAll({
    //       where: { id: productIds },
    //       include: "Users",
    //       transaction,
    //     });
    //     return products;
    //   } catch (error) {
    //     throw error;
    //   }
    // }
  }

  Product.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: { allowNull: false, type: DataTypes.STRING },
      description: { allowNull: true, type: DataTypes.STRING },
      brand: { allowNull: false, type: DataTypes.STRING },
      price: { allowNull: false, type: DataTypes.STRING },
      isAvailable: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Users",
        },
      },
      categoryId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Categories",
        },
      },
      defaultImageId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Images",
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};

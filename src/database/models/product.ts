"use strict";
import { Model, Transaction } from "sequelize";

interface IProductAttributes {
  name: string;
  description?: string;
  brand: string;
  price: string;
  userId: number;
  categoryId: number | null;
  defaultImageId: number | null;
  isAvailable?: boolean;
  deletedAt: Date | null;
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
    [key: string]: any;

    createdAt!: Date;
    updatedAt!: Date;
    deletedAt!: Date | null;

    static associate(models: any) {
      Product.hasMany(models.OrdersProducts, {
        foreignKey: "productId",
        sourceKey: "id",
        as: "product",
      });
      Product.belongsToMany(models.Order, {
        through: "OrdersProducts",
        timestamps: false,
        onDelete: "CASCADE",
        foreignKey: "productId",
      });
      Product.belongsToMany(models.Size, {
        through: "ProductSizes",
        timestamps: false,
        onDelete: "CASCADE",
        foreignKey: "productId",
        as: "sizes",
      });
      Product.belongsToMany(models.Color, {
        through: "ProductColors",
        timestamps: false,
        onDelete: "CASCADE",
        foreignKey: "productId",
        as: "colors",
      });
      Product.belongsTo(models.Image, {
        foreignKey: "defaultImageId",
        as: "defaultImg",
      });
      Product.hasMany(models.Image, {
        foreignKey: "productId",
        sourceKey: "id",
        as: "images",
      });
      Product.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      Product.hasMany(models.Cart, {
        foreignKey: "productId",
        sourceKey: "id",
        onDelete: "CASCADE",
      });
      Product.hasMany(models.BuyLater, {
        foreignKey: "productId",
        sourceKey: "id",
        onDelete: "CASCADE",
      });
    }

    public async addSizes(sizeIds: number[], transaction: Transaction) {
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

    public async addColors(colorIds: number[], transaction: Transaction) {
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

    public async removeSizes(sizeIds: number[], transaction: Transaction) {
      try {
        await sequelize.query(
          `DELETE FROM ProductSizes WHERE sizeId IN (${sizeIds.join(
            ","
          )}) AND productId = ${this.id}`,
          {
            transaction,
          }
        );
      } catch (error) {
        throw error;
      }
    }

    public async removeColors(colorIds: number[], transaction: Transaction) {
      try {
        await sequelize.query(
          `DELETE FROM ProductColors WHERE colorId IN (${colorIds.join(
            ","
          )}) AND productId = ${this.id}`,
          {
            transaction,
          }
        );
      } catch (error) {
        throw error;
      }
    }
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
      price: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: { isInt: true },
      },
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
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};

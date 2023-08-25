"use strict";
import { Model } from "sequelize";
import { Product } from "./models";

interface IImageAttributes {
  url: string;
  productId: number;
}

export default (sequelize: any, DataTypes: any) => {
  class Image
    extends Model<IImageAttributes & { id: number }, IImageAttributes>
    implements IImageAttributes
  {
    id!: number;
    url!: string;
    productId!: number;

    static associate(models: any) {
      Image.belongsToMany(models.Product, { through: "ProductImages" });
      Image.hasOne(models.Product, { foreignKey: "defaultImageId" });
    }
  }
  Image.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      url: { unique: true, allowNull: false, type: DataTypes.STRING },
      productId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Products",
        },
      },
    },
    {
      timestamps: false,
      sequelize,
      modelName: "Image",
      hooks: {
        async beforeDestroy(instance) {
          const product = await Product.findByPk(instance.productId);
          if (product?.defaultImageId === instance.id) {
            product.defaultImageId = null;
            await product.save();
          }
        },
      },
    }
  );
  return Image;
};

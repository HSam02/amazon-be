"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Category, {
        foreignKey: "parent",
        as: "children",
      });
      Category.belongsTo(models.Category, {
        foreignKey: "parent",
        as: "parentCategory",
      });
    }
  }
  Category.init(
    {
      title: DataTypes.STRING,
      parent: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Category",
    },
  );
  return Category;
};

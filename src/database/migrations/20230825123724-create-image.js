"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Images", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      url: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
          key: "id",
        },
      },
    });

    await queryInterface.addColumn("Products", "defaultImageId", {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: "Images",
        key: "id",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "defaultImageId");
    await queryInterface.dropTable("Images");
  },
};

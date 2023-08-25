"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductSizes", {
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
          key: "id",
        },
      },
      sizeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Sizes",
          key: "id",
        },
      },
    });

    await queryInterface.createTable("ProductColors", {
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
          key: "id",
        },
      },
      colorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Colors",
          key: "id",
        },
      },
    });

    await queryInterface.createTable("ProductImages", {
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
          key: "id",
        },
      },
      imageId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Images",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProductSizes");
    await queryInterface.dropTable("ProductColors");
    await queryInterface.dropTable("ProductImages");
  },
};

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Addresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addColumn("Users", "defaultAddressId", {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: "Addresses",
        key: "id",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "defaultAddressId");
    await queryInterface.dropTable("Addresses");
  },
};

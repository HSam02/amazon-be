"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const sizesData = [
      { id: 1, value: "Small" },
      { id: 2, value: "Medium" },
      { id: 3, value: "Large" },
    ];

    await queryInterface.bulkInsert("Sizes", sizesData, {});
  },

  async down(queryInterface, Sequelize) {
    const idsToDelete = [1, 2, 3];

    await queryInterface.bulkDelete("Sizes", {
      id: idsToDelete,
    });
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const colorsData = [
      { id: 1, value: "Red" },
      { id: 2, value: "Blue" },
      { id: 3, value: "Green" },
      { id: 4, value: "Yellow" },
      { id: 5, value: "Purple" },
      { id: 6, value: "Orange" },
      { id: 7, value: "Pink" },
      { id: 8, value: "Black" },
      { id: 9, value: "White" },
    ];

    await queryInterface.bulkInsert("Colors", colorsData, {});
  },

  async down(queryInterface, Sequelize) {
    const idsToDelete = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    await queryInterface.bulkDelete("Colors", {
      id: idsToDelete,
    });
  },
};

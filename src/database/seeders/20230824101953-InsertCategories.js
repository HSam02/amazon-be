"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categoriesData = [
      { id: 1, title: "Electronics", parentId: null },
      { id: 2, title: "Phones", parentId: 1 },
      { id: 3, title: "Laptops", parentId: 1 },
      { id: 4, title: "Clothing", parentId: null },
      { id: 5, title: "Men's Clothing", parentId: 4 },
      { id: 6, title: "Women's Clothing", parentId: 4 },
      { id: 7, title: "Shoes", parentId: 5 },
      { id: 8, title: "Accessories", parentId: 5 },
      { id: 9, title: "Dresses", parentId: 6 },
    ];
    await queryInterface.bulkInsert("Categories", categoriesData, {});
  },

  async down(queryInterface, Sequelize) {
    const idsToDelete = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    await queryInterface.bulkDelete("Categories", {
      id: idsToDelete,
    });
  },
};

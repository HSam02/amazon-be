import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn("Colors", "value", {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.changeColumn("Colors", "value", {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    });
  },
};

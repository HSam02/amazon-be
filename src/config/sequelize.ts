import { Sequelize } from "sequelize";

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize({
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  dialect: "mysql",
});

export default sequelize;

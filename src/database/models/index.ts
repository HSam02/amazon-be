import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import { Sequelize, DataTypes } from "sequelize";
import { env as _env } from "process";
import * as configs from "../config/config.json";
const basename = _basename(__filename);
const env = _env.NODE_ENV || "development";
// @ts-ignore
const config = configs[env];
const db: Record<string, any> = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(_env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".ts" &&
      file.indexOf(".test.ts") === -1
    );
  })
  .forEach((file) => {
    const model = require(join(__dirname, file)).default(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

/**
 * Загрузчик моделей
 * @author Nikita Bersenev
 */

const fs = require("fs");
const path = require("path");
const sequelize = require("sequelize");

const Sequelize = new sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    operatorsAliases: false
  }
);

const db = {};

fs.readdirSync(__dirname)
  .filter(folder => {
    return folder.indexOf(".") === -1;
  })
  .forEach(folder => {
    const model = Sequelize.import(path.join(__dirname, folder, "index.js"));
    db[model.name[0].toUpperCase() + model.name.slice(1)] = model;
  });

Object.keys(db).forEach(modelName => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

Sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

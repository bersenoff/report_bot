/**
 * @name Пользователь
 * @author Nikita Bersenev
 */

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "bot_user",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        notEmpty: true
      },
      id_telegram: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      telegram_first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      telegram_last_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      telegram_username: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      allow: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        notEmpty: true,
        defaultValue: false
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["id_telegram"]
        },
        {
          unique: true,
          fields: ["telegram_username"]
        }
      ]
    }
  );

  return User;
};

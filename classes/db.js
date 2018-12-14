/**
 * Класс для работы с MySQL
 * @author Nikita Bersenev
 */

module.exports = class DB {
  constructor(readonly = false) {
    const mysql = require("mysql");

    let user = process.env.MYSQL_USER;
    let password = process.env.MYSQL_PASSWORD;

    if (readonly) {
      user = process.env.MYSQL_READ_USER;
      password = process.env.MYSQL_READ_PASSWORD;
    }

    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.MYSQL_HOST,
      user,
      password,
      dateStrings: true
    });
  }

  query(sql, values = null) {
    // Выполнение sql-запроса
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) return reject(err);

        connection.query({ sql, values }, (err, data) => {
          connection.release();

          if (err) reject(err);

          return resolve({ data });
        });
      });
    });
  }
};

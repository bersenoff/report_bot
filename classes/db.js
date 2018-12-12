/**
 * Класс для работы с MySQL
 * @author Nikita Bersenev
 */

class DB {
  constructor() {
    const mysql = require("mysql");

    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
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
}

module.exports = new DB();

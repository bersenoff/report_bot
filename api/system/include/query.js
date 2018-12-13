module.exports = async msg => {
  const segments = msg.toLowerCase().split('"');
  let sql = segments[1];

  let res = "";

  if (typeof sql === "undefined") {
    res = "Вы не ввели sql-запрос 😊";
    return res;
  }

  let allow = true;

  if (sql.indexOf("insert") !== -1) allow = false;
  if (sql.indexOf("update") !== -1) allow = false;
  if (sql.indexOf("delete") !== -1) allow = false;

  if (!allow) {
    res = "Разрешены только SELECT-запросы 😊";
    return res;
  }

  if (sql.indexOf("limit") === -1) {
    sql += " LIMIT 30";
  }

  let data = [];

  try {
    data = (await db.query(sql)).data;
  } catch (err) {
    res = err.message;
    return res;
  }

  if (data.length) {
    res = "Результат запроса:\n";
    res += "\n[";

    for (let row of data) {
      res += "\nRowDataPacket";
      res += "\n  {";

      for (let key in row) {
        res += `\n   ${key}: '${row[key]}'`;
      }

      res += "\n  },";
    }

    res += "\n]";
  } else {
    res = "Результат запроса пуст 😊";
  }

  return res;
};

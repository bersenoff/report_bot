/**
 * Отчет по заметкам
 */

module.exports = async () => {
  const moment = require("moment");

  const data = (await db.query(
    `
    SELECT
      date AS date, 
      COUNT(*) AS total
    FROM ??
    GROUP BY date
    ORDER BY date DESC LIMIT 30
  `,
    ["reportdb.dataumbnotes"]
  )).data;

  let msg = "Сводный отчет по количеству заметок за последние 30 дней:\n";

  for (let row of data) {
    msg += `\n${moment(row.date).format("DD.MM.YYYY")} - ${row.total}`;
  }

  return msg;
};

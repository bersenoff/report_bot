/**
 * Отчет по заметкам
 */

module.exports = async () => {
  const data = await db.query(
    `
    SELECT
      date AS date, 
      COUNT(*) AS total
    FROM ??
    GROUP BY date
    ORDER BY date LIMIT 30
  `,
    ["reportdb.dataumbnotes"]
  );

  let msg = "Сводный отчет по количеству заметок за последние 30 дней:\n";

  for (let row of data) {
    msg += `\n${row.date} - ${row.total}`;
  }

  return msg;
};

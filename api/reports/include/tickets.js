module.exports = async () => {
  const data = (await db.query(
    `
        SELECT
            DATE(closeddatetime) AS date,
            COUNT(*) AS total
        FROM ??
        GROUP BY DATE(closeddatetime)
        ORDER BY DATE(closeddatetime) DESC
        LIMIT 30
    `,
    ["reportdb.databpmaccidents"]
  )).data;

  let msg = "Сводный отчет по количеству тикетов за последние 30 дней:\n";

  for (let row of data) {
    msg += `\n${moment(row.date).format("DD.MM.YYYY")} - ${row.total}`;
  }

  return msg;
};

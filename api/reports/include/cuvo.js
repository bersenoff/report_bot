module.exports = async () => {
  const data = (await db.query(
    `
        SELECT
            date AS date,
            SUM(\`1q1ev\`+\`1q2ev\`+\`1q3ev\`+\`1q4ev\`+\`1q5ev\`) AS total
        FROM ??
        GROUP BY date
        ORDER BY date DESC
        LIMIT 30
    `,
    ["reportdb.datacuvocommon2q"]
  )).data;

  let msg = "Сводный отчет по количеству оценок за последние 30 дней:\n";

  for (let row of data) {
    msg += `\n${moment(row.date).format("DD.MM.YYYY")} - ${row.total}`;
  }

  return msg;
};

module.exports = async () => {
  const data = (await db.query(
    `
        SELECT DISTINCT date
        FROM ??
        ORDER BY date DESC 
        LIMIT 30
      `,
    ["reportdb.dataskillday"]
  )).data;

  let msg = "ReportDay:\n";

  for (let row of data) {
    msg += `\n${moment(row.date).format("DD.MM.YYYY")}`;
  }

  return msg;
};

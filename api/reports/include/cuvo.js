module.exports = async (chat, bot) => {
  const fs = require("fs");
  const data = (await DB.query(
    `
        SELECT
            DATE_FORMAT(date, '%d.%m.%Y') AS \`Дата\`,
            SUM(\`1q1ev\`+\`1q2ev\`+\`1q3ev\`+\`1q4ev\`+\`1q5ev\`) AS \`Количество\`
        FROM ??
        GROUP BY date
        ORDER BY date DESC
        LIMIT 7
    `,
    ["reportdb.datacuvocommon2q"]
  )).data;

  const title = "Сводный отчет по количеству оценок за последнюю неделю";

  try {
    const image = await new Table(title, data).render();
    const options = {
      filename: title,
      contentType: "image/png"
    };
    bot.sendPhoto(chat.id, fs.readFileSync(image), {}, options);
    bot.finish(chat.id);
  } catch (err) {
    bot.sendMessage(chat.id, err.message);
  }
};

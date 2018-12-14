module.exports = async (chat, bot) => {
  const fs = require("fs");
  const data = (await DB.query(
    `
        SELECT
            DATE_FORMAT(date, '%d.%m.%Y') AS \`Дата\`,
            COUNT(*) AS \`Количество\`
        FROM ??
        GROUP BY date
        ORDER BY date DESC
        LIMIT 7
    `,
    ["reportdb.dataomnichat"]
  )).data;

  const title = "Сводный отчет по количеству чатов Омничат за последнюю неделю";

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

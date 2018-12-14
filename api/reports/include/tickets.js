module.exports = async (chat, bot) => {
  const fs = require("fs");

  const data = (await DB.query(
    `
        SELECT
            DATE_FORMAT(DATE(closeddatetime), '%d.%m.%Y') AS \`Дата\`,
            COUNT(*) AS \`Количество\`
        FROM ??
        GROUP BY DATE(closeddatetime)
        ORDER BY DATE(closeddatetime) DESC
        LIMIT 7
    `,
    ["reportdb.databpmaccidents"]
  )).data;

  const title = "Сводный отчет по количеству тикетов за последнюю неделю";

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

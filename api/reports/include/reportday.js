module.exports = async (chat, bot) => {
  const fs = require("fs");

  const data = (await DB.query(
    `
        SELECT DISTINCT 
          DATE_FORMAT(date, '%d.%m.%Y') AS \`Дата\`
        FROM ??
        ORDER BY date DESC 
        LIMIT 7
      `,
    ["reportdb.dataskillday"]
  )).data;

  const title = "ReportDay";

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

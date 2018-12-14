module.exports = async (data, bot) => {
  const fs = require("fs");

  const segments = data.text.toLowerCase().split('"');
  let sql = segments[1];

  try {
    if (typeof sql === "undefined") {
      throw new Error("Вы не ввели sql-запрос 😊");
    }

    const ban = ["insert", "update", "delete", "drop", "truncate"];

    for (let value of ban) {
      if (sql.indexOf(value) !== -1) {
        throw new Error("Мне разрешено выполнять только SELECT-запросы 😊");
      }
    }

    if (sql.indexOf("limit") === -1) {
      sql += " limit 30";
    }

    const title = "Результаты запроса";
    const result = (await DB.query(sql)).data;
    const image = await new Table(title, result).render();
    const options = {
      filename: title,
      contentType: "image/png"
    };
    await bot.sendPhoto(data.chat.id, fs.readFileSync(image), {}, options);
    await bot.finish(data.chat.id);
  } catch (err) {
    bot.sendMessage(data.chat.id, err.message);
  }
};

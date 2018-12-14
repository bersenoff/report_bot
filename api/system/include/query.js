module.exports = async (data, bot) => {
  const fs = require("fs");
  const DBRead = new (require(appRoot + "/classes/DB"))(true);

  const segments = data.text.toLowerCase().split('"');
  let sql = segments[1];

  try {
    if (typeof sql === "undefined") {
      throw new Error("Вы не ввели sql-запрос 😊");
    }

    if (sql.indexOf("limit") === -1) {
      sql += " limit 30";
    }

    const title = "Результаты запроса";
    const result = (await DBRead.query(sql)).data;
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

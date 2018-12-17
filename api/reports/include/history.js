/**
 * Отчет по History
 */

const fs = require("fs");

module.exports = async (chat, bot) => {
  try {
    const history_new = await stat(
      "\\\\t2ru\\zrfolders\\WFM-Reports\\Day\\HistoryP_new\\History_new.xlsm"
    );
    const history_old = await stat(
      "\\\\t2ru\\zrfolders\\WFM-Reports\\Day\\HistoryP_old\\History_old.xlsm"
    );

    const title = "History";
    const data = [
      {
        Отчет: "History_new",
        Обновлен: `${moment(history_new.mtime).format(
          "DD.MM.YYYY"
        )}, в ${moment(history_new.mtime).format("HH:mm")}`
      },
      {
        Отчет: "History_old",
        Обновлен: `${moment(history_old.mtime).format(
          "DD.MM.YYYY"
        )}, в ${moment(history_old.mtime).format("HH:mm")}`
      }
    ];

    const image = await new Table(title, data).render();
    const options = {
      filename: title,
      contentType: "image/png"
    };

    await bot.sendPhoto(chat.id, fs.readFileSync(image), {}, options);
    await bot.finish(chat.id);
  } catch (err) {
    bot.sendMessage(chat.id, err.message);
  }
};

const stat = path => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) reject(err);
      else resolve(stats);
    });
  });
};

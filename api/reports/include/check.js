/**
 * Проверка дневных отчетов
 * @author Nikita Bersenev
 */

module.exports = async (chat, bot) => {
  const fs = require("fs");

  // Период проверки данных
  const period = [
    moment()
      .subtract(1, "d")
      .format("DD.MM.YYYY"),
    moment()
      .subtract(2, "d")
      .format("DD.MM.YYYY"),
    moment()
      .subtract(3, "d")
      .format("DD.MM.YYYY"),
    moment()
      .subtract(4, "d")
      .format("DD.MM.YYYY"),
    moment()
      .subtract(5, "d")
      .format("DD.MM.YYYY"),
    moment()
      .subtract(6, "d")
      .format("DD.MM.YYYY"),
    moment()
      .subtract(7, "d")
      .format("DD.MM.YYYY")
  ];
  // Допустимое отклонение количества от среднего значения за период
  const valid_deviation = 0.3;

  const today = moment().format("DD.MM.YYYY");

  bot.sendMessage(chat.id, "Проверяю заметки...");
  const notes = (await DB.query(
    `
        SELECT
          DATE_FORMAT(date, '%d.%m.%Y') AS \`date_str\`,
          COUNT(*) AS \`count\`
        FROM ??
        GROUP BY date
        ORDER BY date DESC
        LIMIT ${period.length + 1}
      `,
    ["reportdb.dataumbnotes"]
  )).data;
  console.log(notes);

  bot.sendMessage(chat.id, "Проверяю тикеты...");
  const tickets = (await DB.query(
    `
          SELECT
              DATE_FORMAT(DATE(closeddatetime), '%d.%m.%Y') AS \`date_str\`,
              COUNT(*) AS \`count\`
          FROM ??
          GROUP BY DATE(closeddatetime)
          ORDER BY DATE(closeddatetime) DESC
          LIMIT ${period.length + 1}
      `,
    ["reportdb.databpmaccidents"]
  )).data;
  console.log(tickets);

  bot.sendMessage(chat.id, "Проверяю CuVo...");
  const cuvo = (await DB.query(
    `
          SELECT
              DATE_FORMAT(date, '%d.%m.%Y') AS \`date_str\`,
              SUM(\`1q1ev\`+\`1q2ev\`+\`1q3ev\`+\`1q4ev\`+\`1q5ev\`) AS \`count\`
          FROM ??
          GROUP BY date
          ORDER BY date DESC
          LIMIT ${period.length + 1}
      `,
    ["reportdb.datacuvocommon2q"]
  )).data;
  console.log(cuvo);

  let days_notes = period.length;
  let sum_notes = 0;
  let notes_status = "<span style='color: green'>OK</span>";
  let notes_status_codes = [];
  let notes_status_info = "";

  let days_tickets = period.length;
  let sum_tickets = 0;
  let tickets_status = "<span style='color: green'>OK</span>";
  let tickets_status_codes = [];
  let tickets_status_info = "";

  let days_cuvo = period.length;
  let sum_cuvo = 0;
  let cuvo_status = "<span style='color: green'>OK</span>";
  let cuvo_status_codes = [];
  let cuvo_status_info = "";

  for (let row of notes) {
    if (row.date_str !== today) {
      sum_notes += row.count;
    } else {
      days_notes--;
    }
  }

  for (let row of tickets) {
    if (row.date_str !== today) {
      sum_tickets += row.count;
    } else {
      days_tickets--;
    }
  }

  for (let row of cuvo) {
    if (row.date_str !== today) {
      sum_cuvo += row.count;
    } else {
      days_cuvo--;
    }
  }

  for (let date of period) {
    let notes_code = 2;
    let notes_deviation = 0;
    let tickets_code = 2;
    let tickets_deviation = 0;
    let cuvo_code = 2;
    let cuvo_deviation = 0;

    for (let row of notes) {
      if (row.date_str !== today) {
        if (row.date_str === date) {
          notes_deviation =
            Math.round(
              Math.abs(1 - row.count / (sum_notes / days_notes)) * 100
            ) / 100;

          if (notes_deviation > valid_deviation) {
            notes_code = 1;
          } else {
            notes_code = 0;
          }
        }
      }
    }

    for (let row of tickets) {
      if (row.date_str !== today) {
        if (row.date_str === date) {
          tickets_deviation =
            Math.round(
              Math.abs(1 - row.count / (sum_tickets / days_tickets)) * 100
            ) / 100;

          if (tickets_deviation > valid_deviation) {
            tickets_code = 1;
          } else {
            tickets_code = 0;
          }
        }
      }
    }

    for (let row of cuvo) {
      if (row.date_str !== today) {
        if (row.date_str === date) {
          cuvo_deviation =
            Math.round(Math.abs(1 - row.count / (sum_cuvo / days_cuvo)) * 100) /
            100;

          if (cuvo_deviation > valid_deviation) {
            cuvo_code = 1;
          } else {
            cuvo_code = 0;
          }
        }
      }
    }

    notes_status_codes.push(notes_code);
    tickets_status_codes.push(tickets_code);
    cuvo_status_codes.push(cuvo_code);

    if (notes_code === 2) {
      if (notes_status_info.length)
        notes_status_info += `<br />Отсутствуют данные за ${date}`;
      else notes_status_info += `Отсутствуют данные за ${date}`;
    } else if (notes_code === 1) {
      if (notes_status_info.length)
        notes_status_info += `<br />За ${date} отклонение от среднего значения более 30% (${notes_deviation *
          100}%)`;
      else
        notes_status_info += `За ${date} отклонение от среднего значения более 30% (${notes_deviation *
          100}%)`;
    }

    if (tickets_code === 2) {
      if (tickets_status_info.length)
        tickets_status_info += `<br />Отсутствуют данные за ${date}`;
      else tickets_status_info += `Отсутствуют данные за ${date}`;
    } else if (tickets_code === 1) {
      if (tickets_status_info.length)
        tickets_status_info += `<br />За ${date} отклонение от среднего значения более 30% (${tickets_deviation *
          100}%)`;
      else
        tickets_status_info += `За ${date} отклонение от среднего значения более 30% (${tickets_deviation *
          100}%)`;
    }

    if (cuvo_code === 2) {
      if (cuvo_status_info.length)
        cuvo_status_info += `<br />Отсутствуют данные за ${date}`;
      else cuvo_status_info += `Отсутствуют данные за ${date}`;
    } else if (cuvo_code === 1) {
      if (cuvo_status_info.length)
        cuvo_status_info += `<br />За ${date} отклонение от среднего значения более 30% (${cuvo_deviation *
          100}%)`;
      else
        cuvo_status_info += `За ${date} отклонение от среднего значения более 30% (${cuvo_deviation *
          100}%)`;
    }
  }

  if (notes_status_codes.indexOf(2) !== -1)
    notes_status = "<span style='color: red'>Проблема</span>";
  else if (notes_status_codes.indexOf(1) !== -1)
    notes_status = "<span style='color: orange'>Внимание</span>";

  if (tickets_status_codes.indexOf(2) !== -1)
    tickets_status = "<span style='color: red'>Проблема</span>";
  else if (tickets_status_codes.indexOf(1) !== -1)
    tickets_status = "<span style='color: orange'>Внимание</span>";

  if (cuvo_status_codes.indexOf(2) !== -1)
    cuvo_status = "<span style='color: red'>Проблема</span>";
  else if (cuvo_status_codes.indexOf(1) !== -1)
    cuvo_status = "<span style='color: orange'>Внимание</span>";

  const title = "Результаты мониторинга ежедневной отчетности";
  const data = [
    {
      Отчет: "Заметки",
      Статус: notes_status,
      Комментарий: notes_status_info
    },
    {
      Отчет: "Тикеты",
      Статус: tickets_status,
      Комментарий: tickets_status_info
    },
    {
      Отчет: "CuVo",
      Статус: cuvo_status,
      Комментарий: cuvo_status_info
    }
  ];

  try {
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

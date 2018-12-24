/**
 * Проверка дневных отчетов
 * @author Nikita Bersenev
 */

module.exports = async (bot, chat = false) => {
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
  const yesterday = moment()
    .subtract(1, "d")
    .format("DD.MM.YYYY");

  if (chat) bot.sendMessage(chat.id, "Проверяю заметки...");
  const notes = (await DB.query(
    `
        SELECT
          DATE_FORMAT(date, '%d.%m.%Y') AS \`date_str\`,
          COUNT(*) AS \`count\`
        FROM ??
        GROUP BY date
        ORDER BY date DESC
        LIMIT ?
      `,
    ["reportdb.dataumbnotes", period.length + 1]
  )).data;

  if (chat) bot.sendMessage(chat.id, "Проверяю тикеты...");
  const tickets = (await DB.query(
    `
          SELECT
              DATE_FORMAT(DATE(closeddatetime), '%d.%m.%Y') AS \`date_str\`,
              COUNT(*) AS \`count\`
          FROM ??
          GROUP BY DATE(closeddatetime)
          ORDER BY DATE(closeddatetime) DESC
          LIMIT ?
      `,
    ["reportdb.databpmaccidents", period.length + 1]
  )).data;

  if (chat) bot.sendMessage(chat.id, "Проверяю CuVo...");
  const cuvo = (await DB.query(
    `
          SELECT
              DATE_FORMAT(date, '%d.%m.%Y') AS \`date_str\`,
              SUM(\`1q1ev\`+\`1q2ev\`+\`1q3ev\`+\`1q4ev\`+\`1q5ev\`) AS \`count\`
          FROM ??
          GROUP BY date
          ORDER BY date DESC
          LIMIT ?
      `,
    ["reportdb.datacuvocommon2q", period.length + 1]
  )).data;

  if (chat) bot.sendMessage(chat.id, "Проверяю Омничат...");
  const omnichat = (await DB.query(
    `
        SELECT
            DATE_FORMAT(date, '%d.%m.%Y') AS \`date_str\`,
            COUNT(*) AS \`count\`
        FROM ??
        GROUP BY date
        ORDER BY date DESC
        LIMIT ?
    `,
    ["reportdb.dataomnichat", period.length + 1]
  )).data;

  if (chat) bot.sendMessage(chat.id, "Проверяю ReportDay...");
  const reportday = (await DB.query(
    `
        SELECT DISTINCT 
          DATE_FORMAT(date, '%d.%m.%Y') AS \`date_str\`
        FROM ??
        ORDER BY date DESC 
        LIMIT ?
      `,
    ["reportdb.dataskillday", period.length + 1]
  )).data;

  if (chat) bot.sendMessage(chat.id, "Проверяю трафик перелив...");
  const traffic = (await DB.query(
    `
          SELECT DISTINCT 
            DATE_FORMAT(date, '%d.%m.%Y') AS \`date_str\`
          FROM ??
          ORDER BY date DESC
          LIMIT ?
      `,
    ["reportdb.dataacdcms", period.length + 1]
  )).data;

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

  let days_omnichat = period.length;
  let sum_omnichat = 0;
  let omnichat_status = "<span style='color: green'>OK</span>";
  let omnichat_status_codes = [];
  let omnichat_status_info = "";

  let reportday_status = "<span style='color: green'>OK</span>";
  let reportday_status_codes = [];
  let reportday_status_info = "";

  let traffic_status = "<span style='color: green'>OK</span>";
  let traffic_status_codes = [];
  let traffic_status_info = "";

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

  for (let row of omnichat) {
    if (row.date_str !== today || row.date_str !== yesterday) {
      sum_omnichat += row.count;
    } else {
      days_omnichat--;
    }
  }

  for (let date of period) {
    let notes_code = 2;
    let notes_deviation = 0;
    let tickets_code = 2;
    let tickets_deviation = 0;
    let cuvo_code = 2;
    let cuvo_deviation = 0;
    let omnichat_code = 2;
    let omnichat_deviation = 0;
    let reportday_code = 2;
    let traffic_code = 2;

    if (date === yesterday) {
      // не учитывать вчерашний день
      omnichat_code = 0;
    }

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

    for (let row of omnichat) {
      if (row.date_str !== today && row.date_str !== yesterday) {
        if (row.date_str === date) {
          omnichat_deviation =
            Math.round(
              Math.abs(1 - row.count / (sum_omnichat / days_omnichat)) * 100
            ) / 100;

          if (omnichat_deviation > valid_deviation) {
            omnichat_code = 1;
          } else {
            omnichat_code = 0;
          }
        }
      }
    }

    for (let row of reportday) {
      if (row.date_str === date) {
        reportday_code = 0;
      }
    }

    for (let row of traffic) {
      if (row.date_str === date) {
        traffic_code = 0;
      }
    }

    notes_status_codes.push(notes_code);
    tickets_status_codes.push(tickets_code);
    cuvo_status_codes.push(cuvo_code);
    omnichat_status_codes.push(omnichat_code);
    reportday_status_codes.push(reportday_code);
    traffic_status_codes.push(traffic_code);

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

    if (omnichat_code === 2) {
      if (omnichat_status_info.length)
        omnichat_status_info += `<br />Отсутствуют данные за ${date}`;
      else omnichat_status_info += `Отсутствуют данные за ${date}`;
    } else if (omnichat_code === 1) {
      if (omnichat_status_info.length)
        omnichat_status_info += `<br />За ${date} отклонение от среднего значения более 30% (${omnichat_deviation *
          100}%)`;
      else
        omnichat_status_info += `За ${date} отклонение от среднего значения более 30% (${omnichat_deviation *
          100}%)`;
    }

    if (reportday_code === 2) {
      if (reportday_status_info.length)
        reportday_status_info += `<br />Отсутствуют данные за ${date}`;
      else reportday_status_info += `Отсутствуют данные за ${date}`;
    }

    if (traffic_code === 2) {
      if (traffic_status_info.length)
        traffic_status_info += `<br />Отсутствуют данные за ${date}`;
      else traffic_status_info += `Отсутствуют данные за ${date}`;
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

  if (omnichat_status_codes.indexOf(2) !== -1)
    omnichat_status = "<span style='color: red'>Проблема</span>";
  else if (omnichat_status_codes.indexOf(1) !== -1)
    omnichat_status = "<span style='color: orange'>Внимание</span>";

  if (reportday_status_codes.indexOf(2) !== -1)
    reportday_status = "<span style='color: red'>Проблема</span>";

  if (traffic_status_codes.indexOf(2) !== -1)
    traffic_status = "<span style='color: red'>Проблема</span>";

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
    },
    {
      Отчет: "Омничат",
      Статус: omnichat_status,
      Комментарий: omnichat_status_info
    },
    {
      Отчет: "ReportDay",
      Статус: reportday_status,
      Комментарий: reportday_status_info
    },
    {
      Отчет: "Трафик перелив",
      Статус: traffic_status,
      Комментарий: traffic_status_info
    }
  ];

  try {
    const image = await new Table(title, data).render();
    const options = {
      filename: title,
      contentType: "image/png"
    };
    if (chat) {
      await bot.sendPhoto(chat.id, fs.readFileSync(image), {}, options);
      await bot.finish(chat.id);
    } else {
      await bot.sendAll("Я тут планово проверил дневные отчеты 😊");
      await bot.sendPhotoAll(fs.readFileSync(image), {}, options);
    }
  } catch (err) {
    if (chat) {
      bot.sendMessage(chat.id, err.message);
    } else {
      await bot.sendAll(
        "Я тут планово решил проверить дневные отчеты, но у меня не получилось 😓"
      );
      await bot.sendAll(err.message);
    }
  }
};

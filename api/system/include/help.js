module.exports = async () => {
  let msg = "Список доступных команд:\n";
  msg += "\n/notes - сводный отчет по количеству заметок за последние 30 дней";
  msg +=
    "\n/tickets - сводный отчет по количеству тикетов за последние 30 дней";
  msg += "\n/cuvo - сводный отчет по количеству оценок за последние 30 дней";
  msg +=
    "\n/omnichat - сводный отчет по количеству чатов Омничат за последние 30 дней";
  msg += "\n/reportday - ReportDay";
  msg += "\n/traffic - Траффик перелив";

  return msg;
};

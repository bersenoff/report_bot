module.exports = async () => {
  let msg = "Список доступных команд:\n";
  msg += "\n/notes - сводный отчет по количеству заметок за последние 30 дней";
  msg +=
    "\n/tickets - сводный отчет по количеству тикетов за последние 30 дней";

  return msg;
};

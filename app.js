require("dotenv").config();
const Agent = require("socks5-https-client/lib/Agent");
const TelegramBot = require("node-telegram-bot-api");

global.api = require("./api");
global.db = require("./classes/db");

const bot = new TelegramBot(process.env.TOKEN, {
  polling: true,
  request: {
    agentClass: Agent,
    agentOptions: {
      socksHost: "127.0.0.1",
      socksPort: 9150
    }
  }
});

bot.onText(/\/ping/, data => {
  // проверка ответа сервера
  bot.sendMessage(data.id.chat, "Все впорядке, я живой :)");
});

bot.onText(/\/notes/, async data => {
  // отчет по заметкам
  const msg = await api.reports.notes();
  bot.sendMessage(data.chat.id, msg);
});

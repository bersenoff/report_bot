require("dotenv").config();
const Agent = require("socks5-https-client/lib/Agent");
const TelegramBot = require("node-telegram-bot-api");
const temp = require("./templates");

global.api = require("./api");
global.db = require("./classes/db");
global.moment = require("moment");

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

bot.on("message", async data => {
  switch (data.text) {
    case "/help":
      bot.sendMessage(data.chat.id, await api.system.help());
      break;
    case "/notes":
      understand(data.chat.id);
      bot.sendMessage(data.chat.id, await api.reports.notes());
      finish(data.chat.id);
      break;
    case "/tickets":
      understand(data.chat.id);
      bot.sendMessage(data.chat.id, await api.reports.tickets());
      finish(data.chat.id);
      break;
    case "/cuvo":
      understand(data.chat.id);
      bot.sendMessage(data.chat.id, await api.reports.cuvo());
      finish(data.chat.id);
      break;
    default:
      if (!dialog(data.chat.id, data.text)) {
        bot.sendMessage(data.chat.id, "К сожалению, я тебя не понимаю 😔");
      }
      break;
  }
});

const understand = chatId => {
  bot.sendMessage(chatId, "Запрос принят, сейчас сформирую данные 😌");
};

const finish = chatId => {
  bot.sendMessage(chatId, "Готово, всегда рад помочь 😉");
};

const dialog = (chatId, text) => {
  let found = false;
  for (let key in temp.incoming) {
    temp.incoming[key].forEach(item => {
      if (text.toLowerCase().indexOf(item) !== -1) {
        found = true;
        bot.sendMessage(
          chatId,
          temp.outgoing[key][
            Math.floor(Math.random() * temp.outgoing[key].length)
          ]
        );
      }
    });
  }
  return found;
};

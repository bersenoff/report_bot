require("dotenv").config();
const Agent = require("socks5-https-client/lib/Agent");
const TelegramBot = require("node-telegram-bot-api");
const CronJob = require("cron").CronJob;
const temp = require("./templates");
const Models = require("./models");
const User = Models.Bot_user;

global.appRoot = __dirname;
global.api = require("./api");
global.DB = new (require("./classes/DB"))();
global.Table = require("./classes/Table");
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

new CronJob(
  "0 0 7 * * *",
  () => {
    api.reports.check(bot);
  },
  null,
  true,
  "Europe/Moscow"
);

bot.on("message", async data => {
  if (await api.system.auth(data.chat)) {
    switch (data.text.toLowerCase()) {
      case "/help":
        bot.sendMessage(data.chat.id, await api.system.help());
        break;
      case "/notes":
        await bot.understand(data.chat.id);
        await api.reports.notes(data.chat, bot);
        break;
      case "/tickets":
        await bot.understand(data.chat.id);
        await api.reports.tickets(data.chat, bot);
        break;
      case "/cuvo":
        await bot.understand(data.chat.id);
        await api.reports.cuvo(data.chat, bot);
        break;
      case "/omnichat":
        await bot.understand(data.chat.id);
        await api.reports.omnichat(data.chat, bot);
        break;
      case "/reportday":
        await bot.understand(data.chat.id);
        await api.reports.reportday(data.chat, bot);
        break;
      case "/traffic":
        await bot.understand(data.chat.id);
        await api.reports.traffic(data.chat, bot);
        break;
      case "/history":
        await bot.understand(data.chat.id);
        await api.reports.history(data.chat, bot);
        break;
      case "/check":
        await bot.hard(data.chat.id);
        await api.reports.check(bot, data.chat);
        break;
      default:
        if (data.text.toLowerCase().indexOf("/sql") !== -1) {
          await bot.understand(data.chat.id);
          await api.system.query(data, bot);
        } else if (data.text.toLowerCase().indexOf("/cscript") !== -1) {
          await api.system.cscript(data, bot);
        } else if (!bot.dialog(data.chat.id, data.text)) {
          bot.sendMessage(
            data.chat.id,
            temp.outgoing.other[
            Math.floor(Math.random() * temp.outgoing.other.length)
            ]
          );
        }
        break;
    }
  } else {
    bot.sendMessage(
      data.chat.id,
      "Я вас не знаю, поэтому буду игнорировать 😊"
    );
  }
});

bot.understand = chatId => {
  bot.sendMessage(
    chatId,
    temp.outgoing.understand[
    Math.floor(Math.random() * temp.outgoing.understand.length)
    ]
  );
};

bot.hard = chatId => {
  bot.sendMessage(
    chatId,
    temp.outgoing.hard[Math.floor(Math.random() * temp.outgoing.hard.length)]
  );
};

bot.finish = chatId => {
  bot.sendMessage(
    chatId,
    temp.outgoing.finish[
    Math.floor(Math.random() * temp.outgoing.finish.length)
    ]
  );
};

bot.dialog = (chatId, text) => {
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

bot.sendAll = async text => {
  const users = await User.findAll({
    where: {
      allow: true
    }
  });

  for (let user of users) {
    bot.sendMessage(user.id_telegram, text);
  }
};

bot.sendPhotoAll = async (image, settings, options) => {
  const users = await User.findAll({
    where: {
      allow: true
    }
  });

  for (let user of users) {
    bot.sendPhoto(user.id_telegram, image, settings, options);
  }
};

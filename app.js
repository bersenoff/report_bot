require("dotenv").config();
const Agent = require("socks5-https-client/lib/Agent");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

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

bot.onText(/\/test/, data => {
  bot.sendMessage(data.chat.id, "Work it!");
});

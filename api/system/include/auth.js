module.exports = async chat => {
  const Models = require("../../../models");
  const User = Models.Bot_user;

  const result = await User.findOrCreate({
    where: {
      id_telegram: chat.id
    },
    defaults: {
      telegram_first_name: chat.first_name,
      telegram_last_name: chat.last_name,
      telegram_username: chat.username
    }
  });

  const user = result[0];
  const created = result[1];

  if (!created) {
    user.update({
      telegram_first_name: chat.first_name,
      telegram_last_name: chat.last_name,
      telegram_username: chat.username
    });
  }

  if (user.allow) return true;
  else return false;
};

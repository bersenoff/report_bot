/**
 * Запуск VBS на сервере
 * @author Nikita Bersenev
 */

module.exports = async (data, bot) => {
    const spawn = require('child_process').spawn;
    const cscript = spawn(`cscript ${data.text.replace('/cscript ', '')}`, [], { cwd: 'D:\\SQLReporting\\test\\VBScripts', shell: true });

    cscript.stdout.on('data', (data) => {
        bot.sendMessage(chat.id, data.toString());
    });

    cscript.stderr.on('data', (data) => {
        bot.sendMessage(chat.id, `Ошибка: ${data.toString()}`)
    });

    cscript.on('close', (code) => {
        bot.sendMessage(chat.id, `Скрипт завершился с кодом ${code.toString()}`);
    });

}
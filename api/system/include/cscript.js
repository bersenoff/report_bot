/**
 * Запуск VBS на сервере
 * @author Nikita Bersenev
 */

module.exports = async (data, bot) => {
    const spawn = require('child_process').spawn;
    const cscript = spawn(`cscript ${data.text.replace('/cscript ', '')}`, [], { cwd: 'D:\\SQLReporting\\test\\VBScripts', shell: true });

    cscript.stdout.on('data', (res) => {
        bot.sendMessage(data.chat.id, res.toString());
    });

    cscript.stderr.on('data', (res) => {
        bot.sendMessage(data.chat.id, `Ошибка: ${res.toString()}`)
    });

    cscript.on('close', (code) => {
        bot.sendMessage(data.chat.id, `Скрипт завершился с кодом ${code.toString()}`);
    });

}
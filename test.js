(async () => {
    const child_process = require('child_process');

    child_process.exec('cscript pkOmniChat.vbs', { cwd: 'D:\\SQLReporting\\test\\VBScripts' }, (error, stdout, stderr) => {
        if (error) {
            console.log(`Ошибка командной строки: ${error}`);
            return;
        }

        if (stderr.length) {
            console.log(`Ошибка в скрипте: ${stderr}`);
        }

        console.log(stdout);
    });
})();
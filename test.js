(async () => {
    const spawn = require('child_process').spawn;
    const cscript = spawn('cscript D:\\SQLReporting\\test\\VBScripts\\pkOmniChat.vbs');

    cscript.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    cscript.stderr.on('data', (data) => {
        console.log(data.toString());
    });
})();
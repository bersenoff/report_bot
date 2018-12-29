(async () => {
    const spawn = require('child_process').spawn;
    const cscript = spawn('ls');

    cscript.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    cscript.stderr.on('data', (data) => {
        console.log(data.toString());
    });
})();
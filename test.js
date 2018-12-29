(async () => {
    const child_process = require('child_process');

    const result = await child_process.execSync('cscript pkOmniChat.vbs', { cwd: 'D:\\SQLReporting\\test\\VBScripts' }).toString();

    console.log(result);
})();
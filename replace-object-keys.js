const process = require('process');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv

if (argv._.length !== 3) {
    console.log('Usage: node replace-object-keys.js file search replacement');
    process.exit();
}

const content = JSON.parse(fs.readFileSync(argv._[0]));

const out = {};
for (const key of Object.keys(content)) {
    out[key.replace(argv._[1], argv._[2])] = content[key];
}

fs.writeFileSync(argv._[0], JSON.stringify(out));

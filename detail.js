const process = require('process');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { parseCoverage }  = require('./coverage');

const argv = yargs(hideBin(process.argv)).argv

if (argv._.length !== 1) {
    console.log('Usage: node detail.js coverage-file.xml');
    process.exit();
}

fs.writeFileSync('./out.json', JSON.stringify(parseCoverage(argv._[0], 'files')));

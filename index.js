const fs = require('fs');
const process = require('process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { parseCoverage, compareDetailedCoverages }  = require('./coverage');

const argv = yargs(hideBin(process.argv)).argv

if (argv._.length !== 2) {
    console.log('Usage: npm start base-coverage-file new-coverage-file');
    process.exit();
}

const type = argv.type || 'overall';
const parse = (argv.parse || 'parse') === 'parse';

const baseCoverage = parse ? parseCoverage(argv._[0], type) : JSON.parse(fs.readFileSync(argv._[0]));
const newCoverage = parse ? parseCoverage(argv._[1], type) : JSON.parse(fs.readFileSync(argv._[1]));

console.log(compareDetailedCoverages(baseCoverage, newCoverage));

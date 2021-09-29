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
const baseCoverage = parseCoverage(argv._[0], type);
const newCoverage = parseCoverage(argv._[1], type);

console.log(compareDetailedCoverages(baseCoverage, newCoverage));

const convert = require('xml-js');
const fs = require('fs');
const process = require('process');
const { retrieveDetailedFilesElements, retrieveDetailedPackagesElements, retrieveGlobalMetricsElement, retrieveMetricsElement } = require('./xml');

const compareDetailedCoverages = (oldCoverages, newCoverages) => {
    const out = {
        degraded: [],
        improved: []
    };

    for (const resourceName of Object.keys(oldCoverages)) {
        if (
            typeof newCoverages[resourceName] === 'undefined' ||
            oldCoverages[resourceName].coverage === null ||
            newCoverages[resourceName].coverage === oldCoverages[resourceName].coverage
        ) {
            continue;
        }

        const oldCoverage = Number(oldCoverages[resourceName].coverage).valueOf();
        const newCoverage = Number(newCoverages[resourceName].coverage).valueOf();

        out[newCoverage < oldCoverage ? 'degraded' : 'improved'].push(
            {
                resourceName,
                old: `${oldCoverages[resourceName].covered} / ${oldCoverages[resourceName].total} (${oldCoverages[resourceName].coverage}%)`,
                new: `${newCoverages[resourceName].covered} / ${newCoverages[resourceName].total} (${newCoverages[resourceName].coverage}%)`
            });
    }

    return out.degraded.length === 0 && out.improved.length === 0 ? null : out;
}

const extractCoverageFromPackageElement = (packageElement) => {
    const packageFiles = retrieveDetailedFilesElements(packageElement);
    const out = packageFiles.reduce((previous, current) => {
        const currentCoverage = extractCoverageFromMetricsElement(retrieveMetricsElement(current));

        return {
            total: previous.total + currentCoverage.total,
            covered: previous.covered + currentCoverage.covered
        };
    }, {
        total: 0,
        covered: 0
    });

    out.coverage = out.total > 0 ? parseFloat((100 * out.covered / out.total).toFixed(3)) : 100;

    return out;
}

const extractCoverageFromMetricsElement = (metrics) => {
    const total = parseInt(metrics.attributes.elements, 10);
    const covered = parseInt(metrics.attributes.coveredelements, 10);
    const coverage = total > 0 ? parseFloat((100 * covered / total).toFixed(3)) : 100;

    return { total, covered, coverage };
}

const extractDetailPackageCoverages = (json, elements) => {
    const out = {};

    for (const element of elements) {
        out[element.attributes.name] = extractCoverageFromPackageElement(element);
    }

    return out;
}

const extractDetailedCoverages = (json, elements) => {
    const out = {};

    for (const element of elements) {
        out[element.attributes.name] = extractCoverageFromMetricsElement(retrieveMetricsElement(element));
    }

    return out;
}

const parseCoverage = (filename, type) => {
    const options = { ignoreComment: true, alwaysChildren: true };
    const json = convert.xml2js(fs.readFileSync(filename, { encoding: 'utf8' }), options);

    switch (type) {
        case 'overall':
            return {
                overall: extractCoverageFromMetricsElement(retrieveGlobalMetricsElement(json))
            };
        case 'files':
            return extractDetailedCoverages(json, retrieveDetailedFilesElements(json));
        case 'packages':
            return extractDetailPackageCoverages(json, retrieveDetailedPackagesElements(json));
    }

    console.error('Unknown type ' + type);
    process.exit(-1);
}

module.exports = { compareDetailedCoverages, parseCoverage };

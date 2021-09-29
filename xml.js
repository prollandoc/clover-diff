const process = require('process');

const extractNodes = (tree, name) => {
    if (!tree.elements || tree.elements.length === 0) {
        return [];
    }

    let out = [];
    tree.elements.filter(e => e.name !== name).forEach(e => out = out.concat(extractNodes(e, name)));
    out = out.concat(tree.elements.filter(e => e.name === name));

    return out;
};

const findNode = (tree, name) => {
    if (!tree.elements) {
        console.error('Wrong coverage file format')
        process.exit(-1);
    }

    const element = tree.elements.find(e => e.name === name);

    if (!element) {
        console.error('Wrong coverage file format')
        process.exit(-1);
    }

    return element;
}

const retrieveGlobalMetricsElement = json => findNode(findNode(findNode(json, 'coverage'), 'project'), 'metrics');

const retrieveDetailedFilesElements = json => extractNodes(json, 'file');

const retrieveDetailedPackagesElements = json => extractNodes(json, 'package');

const retrieveMetricsElement = json => findNode(json, 'metrics');

module.exports = { retrieveDetailedFilesElements, retrieveDetailedPackagesElements, retrieveGlobalMetricsElement, retrieveMetricsElement };

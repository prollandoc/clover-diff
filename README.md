# clover-diff
A cli tool build with Node.js to view the difference between two coverage clover files.

## Install

```bash
git clone https://github.com/prollandoc/clover-diff.git
cd clover-diff
npm install
```

## Run

```
node index.js source_coverage.xml destination_coverage.xml
```

### Type

By default, the comparator will only display the overall coverage diff if any

But it can dig deeper than that.

#### Package by package
```
node index.js source_coverage.xml destination_coverage.xml --type=packages
```

#### File by file
```
node index.js source_coverage.xml destination_coverage.xml --type=files
```

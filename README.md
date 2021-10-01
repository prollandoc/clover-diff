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

#### With JSON details files
```
node index.js source_details.json destination_details.json --parse=no-parse
```

## Detail a coverage file into a JSON file

This only works for `files` type now, meaning it will detail your coverage file into a JSON 
file containing the coverages for all your files. Can be great to debug files that have been 
produced by the `OpenClassrooms/coverage-checker` Github action.

```
node detail.js coverage.xml
```

The output file will be stored under `./out.json`

Then you can replace the JSON object's properties names using the following command:

```
node replace-object-keys.js ./out.json '/home/Users/MyDir' 'MyProject'
```

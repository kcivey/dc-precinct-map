#!/usr/bin/env node

const tj = require('@mapbox/togeojson');
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const kml = new DOMParser().parseFromString(fs.readFileSync(process.argv[2], 'utf8'));
const converted = tj.kml(kml);

converted.features.forEach(function (f) {
    for (const propertyName of Object.keys(f.properties)) {
        if (propertyName === 'name') {
            const m = f.properties[propertyName].match(/^Precinct (\d+)/);
            f.id = +m[1];
        }
        else {
            delete f.properties[propertyName];
        }
    }
});

process.stdout.write(JSON.stringify(converted));

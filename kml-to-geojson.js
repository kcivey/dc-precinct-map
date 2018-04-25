#!/usr/bin/env node

var tj = require('@mapbox/togeojson'),
    fs = require('fs'),
    DOMParser = require('xmldom').DOMParser,
    kml = new DOMParser().parseFromString(fs.readFileSync(process.argv[2], 'utf8')),
    converted = tj.kml(kml);

converted.features.forEach(function (f) {
    var propertyName;
    for (propertyName in f.properties) {
        if (propertyName !== 'name') {
            delete f.properties[propertyName];
        }
    }
});

process.stdout.write(JSON.stringify(converted));

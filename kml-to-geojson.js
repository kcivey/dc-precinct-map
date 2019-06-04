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
    if (f.geometry.type === 'GeometryCollection') {
        f.geometry.coordinates = [];
        for (const g of f.geometry.geometries) {
            if (g.type !== 'Polygon') {
                throw new Error(`Unexpected ${g.type} in GeometryCollection`);
            }
            f.geometry.coordinates.push(g.coordinates);
        }
        f.geometry.type = 'MultiPolygon';
        delete f.geometry.geometries;
    }
});

process.stdout.write(JSON.stringify(converted));

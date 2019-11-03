/* globals DcMap, jQuery, L */

jQuery(function () {
    fetch('precincts-2012.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (geoJson) {
            const tileLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/kcivey.i8d7ca3k/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ' +
                    '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                    '<strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">' +
                    'Improve this map</a></strong>',
                opacity: 0.5,
            });
            const style = function (feature, value) {
                value = Math.random() < 0.5 ? 0 : 1;
                return {
                    fillColor: value ? 'black' : 'white',
                    color: value ? 'white' : 'black',
                    weight: 1,
                    fillOpacity: 0.6,
                };
            };
            const data = {};
            const map = new DcMap(geoJson, {tileLayer, style, data, usePopups: false}).display();
            setInterval(setData, 1000);
            function setData() {
                const data = [];
                for (let i = 0; i < 144; i++) {
                    data.push(Math.random() < 0.5 ? 0 : 1);
                }
                map.setData(data);
            }
        });
});

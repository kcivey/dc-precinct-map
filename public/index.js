jQuery(function ($) {
    let map;
    fetch('precincts-2012.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (geoJson) {
            const tileLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/kcivey.i8d7ca3k/{z}/{x}/{y}.png', {
                attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
                opacity: 0.5,
            });
            const data = [];
            for (let i = 0; i < 143; i++) {
                data.push(i % 2 ? 1 : 0);
            }
            const style = function (feature, value) {
                return {
                    fillColor: value ? 'black' : 'white',
                    color: value ? 'white' : 'black',
                    weight: 1,
                    fillOpacity: 0.6,
                };
            };
            map = new DcMap(geoJson, {tileLayer, style, data}).display();
        });
});

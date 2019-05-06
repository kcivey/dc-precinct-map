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
            const emptyStyle = {
                fillColor: 'red',
                color: 'white',
                fillOpacity: 0.8,
                weight: 1,
            };
            map = new DcMap(geoJson, {tileLayer, emptyStyle}).display();
        });
});

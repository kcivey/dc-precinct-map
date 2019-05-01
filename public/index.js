jQuery(function ($) {
    const map = L.map('map');
    const $map = $('#map');
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/kcivey.i8d7ca3k/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
        opacity: 0.5
    }).addTo(map);
    fetch('precincts-2012.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(geoJson) {
            const currentLayer = L.geoJson(geoJson).addTo(map);
            map.fitBounds(currentLayer.getBounds());
        });
    $map.on('map-container-resize', function () {
        setTimeout(function () { map.invalidateSize(); }, 400);
    });
});

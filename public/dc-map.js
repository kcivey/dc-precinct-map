class DcMap {

    constructor(geoJsonData, options = {}) {
        this.properties = {};
        options = Object.assign({id: 'map', geoJsonData}, options);
        this.set(options);
        const handleResize = () => setTimeout(() => this.display(), 250);
        $(window).on('resize', handleResize);
    }

    set(name, value) {
        if (typeof name === 'object') {
            for (const [n, v] of Object.entries(name)) {
                this.set(n, v);
            }
        }
        else {
            this.properties[name] = value;
        }
        return this;
    }

    get(name) {
        if (!name) {
            return this.properties;
        }
        return this.properties[name];
    }

    setId(value) {
        return this.set('id', value);
    }

    getId() {
        return this.get('id');
    }

    setGeoJsonData(value) {
        return this.set('geoJsonData', value === 'string' ? JSON.parse(value) : value);
    }

    getGeoJsonData() {
        return this.get('geoJsonData');
    }

    setTileLayer(value) {
        return this.set('tileLayer', value);
    }

    getTileLayer() {
        return this.get('tileLayer');
    }

    setMap(map) {
        return this.set('map', map);
    }

    getMap() {
        let map = this.get('map');
        if (!map) {
            map = L.map(this.getId());
            this.setMap(map);
        }
        return map;
    }

    setGeoJsonLayer(value) {
        return this.set('geoJsonLayer', value);
    }

    getGeoJsonLayer() {
        let layer = this.get('geoJsonLayer');
        if (!layer) {
            layer = L.geoJson(this.getGeoJsonData()).addTo(this.getMap());
            this.setGeoJsonLayer(layer);
        }
        return layer;
    }

    display() {
        const bounds = this.getGeoJsonLayer().getBounds();
        this.getMap().fitBounds(bounds);
    }

}

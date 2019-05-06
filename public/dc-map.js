class DcMap {

    constructor(geoJsonData, options = {}) {
        this.properties = {};
        const defaultStyle = {
            color: 'black',
            fillColor: 'white',
            fillOpacity: 0.5,
            weight: 1,
        };
        options = Object.assign(
            {id: 'map', geoJsonData},
            options,
            {style: Object.assign({}, defaultStyle, options.style || {})},
        );
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
            const map = this.getMap();
            console.log(name, value);
            switch (name) {
                case 'id':
                    value = L.map(value);
                    this.setMap(value);
                    break;
                case 'tileLayer':
                    value.addTo(map);
                    break;
                case 'geoJsonData':
                    if (typeof value === 'string') {
                        value = JSON.parse(value);
                    }
                    this.setGeoJsonLayer(L.geoJSON(value));
                    break;
                case 'geoJsonLayer':
                    if (this.properties[name]) {
                        this.properties[name].remove();
                    }
                    const style = this.getStyle();
                    if (style) {
                        value.setStyle(style);
                    }
                    value.addTo(map);
                    break;
                case 'style':
                    const layer = this.getGeoJsonLayer();
                    if (layer) {
                        layer.setStyle(value);
                    }
                    console.log('layer', layer);
                    break;
                default:
                    // no addional action
            }
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
        return this.set('geoJsonData', value);
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

    setMap(value) {
        return this.set('map', value);
    }

    getMap() {
        return this.get('map');
    }

    setGeoJsonLayer(value) {
        return this.set('geoJsonLayer', value);
    }

    getGeoJsonLayer() {
        return this.get('geoJsonLayer');
    }

    setStyle(value) {
        return this.set('style', value);
    }

    getStyle() {
        return this.get('style');
    }

    display() {
        const bounds = this.getGeoJsonLayer().getBounds();
        this.getMap().fitBounds(bounds);
        return this;
    }

}

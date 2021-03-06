/* globals L, jQuery */

class DcMap { // eslint-disable-line no-unused-vars

    constructor(geoJsonData, options = {}) {
        this.properties = {};
        options = Object.assign(
            { // order here is important
                id: 'map',
                data: {},
                usePopups: false,
                geoJsonData,
                emptyStyle: {
                    fillColor: 'none',
                    weight: 0,
                },
                tooltipFunction(layer, feature, data) {
                    return feature.id + ': ' + data;
                },
            },
            options,
            {
                style: this.createStyle(options.style),
            }
        );
        this.set(options);
        let resizeTimer;
        const handleResize = () => this.display();
        jQuery(window).on('resize', function () {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(handleResize, 100);
        });
    }

    set(name, value) {
        if (typeof name === 'object') {
            for (const [n, v] of Object.entries(name)) {
                this.set(n, v);
            }
        }
        else {
            const map = this.getMap();
            switch (name) {
                case 'geoJsonData':
                    if (typeof value === 'string') {
                        value = JSON.parse(value);
                    }
                    this.setGeoJsonLayer(L.geoJson(value));
                    this.bindTooltips();
                    break;
                case 'geoJsonLayer': {
                    const oldLayer = this.getGeoJsonLayer();
                    if (oldLayer) {
                        oldLayer.remove();
                    }
                    const style = this.getStyle();
                    if (style) {
                        value.setStyle(style);
                    }
                    value.addTo(map);
                    break;
                }
                case 'id':
                    this.setMap(L.map(value));
                    break;
                case 'style': {
                    value = this.createStyle(value);
                    const layer = this.getGeoJsonLayer();
                    if (layer) {
                        layer.setStyle(value);
                    }
                    break;
                }
                case 'tileLayer':
                    value.addTo(map);
                    break;
                case 'tooltipFunction':
                    value = value.bind(this);
                    break;
                default:
                    // no additional action
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

    bindTooltips() {
        const wrappedTooltipFunction = function (layer) {
            const feature = layer.feature;
            // noinspection JSPotentiallyInvalidUsageOfClassThis
            const data = this.getData(feature.id);
            // noinspection JSPotentiallyInvalidUsageOfClassThis
            return this.getTooltipFunction()(layer, feature, data);
        }.bind(this);
        const method = this.getUsePopups() ? 'bindPopup' : 'bindTooltip';
        this.getGeoJsonLayer().eachLayer(function (layer) {
            layer[method](wrappedTooltipFunction);
        });
    }

    createStyle(style) {
        let innerStyle = style;
        if (!style || typeof style === 'object') {
            const nonEmptyStyle = Object.assign(
                {
                    color: 'black',
                    fillColor: 'white',
                    fillOpacity: 0.5,
                    weight: 1,
                },
                style
            );
            innerStyle = function (feature, value) {
                if (value == null) {
                    // noinspection JSPotentiallyInvalidUsageOfClassThis
                    return this.getEmptyStyle(); // eslint-disable-line no-invalid-this
                }
                return nonEmptyStyle;
            };
        }
        else if (innerStyle.length === 1) {
            return innerStyle;
        }
        return function (feature) {
            // noinspection JSPotentiallyInvalidUsageOfClassThis
            const value = this.getData(feature.id);
            // noinspection JSPotentiallyInvalidUsageOfClassThis
            return innerStyle.call(this, feature, value);
        }.bind(this);
    }

    refreshStyle() {
        return this.setStyle(this.getStyle());
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

    setEmptyStyle(value) {
        return this.set('emptyStyle', value);
    }

    getEmptyStyle() {
        return this.get('emptyStyle');
    }

    setTooltipFunction(value) {
        return this.set('tooltipFunction', value);
    }

    getTooltipFunction() {
        return this.get('tooltipFunction');
    }

    setUsePopups(value) {
        return this.set('usePopups', value);
    }

    getUsePopups() {
        return this.get('usePopups');
    }

    setData(id, value) {
        if (typeof id === 'object') {
            this.properties.data = id;
        }
        else {
            this.properties.data[id] = value;
        }
        this.refreshStyle();
        return this;
    }

    getData(id) {
        const data = this.properties.data;
        if (id == null) {
            return data;
        }
        return (typeof data === 'function') ? data(id) : data[id];
    }

    display() {
        const bounds = this.getGeoJsonLayer().getBounds();
        this.getMap().fitBounds(bounds);
        return this;
    }

}

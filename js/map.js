'use strict';

if (typeof Egf.Cl === 'undefined' || typeof Egf.Util === 'undefined') {
    console.error('The file egf.js is required!');
}

/**
 * LeafLet map class.
 * @url http://leafletjs.com/
 * @url https://github.com/Leaflet/Leaflet.markercluster
 */
Egf.Map = new function () {

    /** @type {string} Container element id. */
    this.sElementId = '';

    /** @type {number} Latitude. -South +North */
    this.fLat = 47.5;

    /** @type {number} Longitude. -West +East */
    this.fLng = 19.0;

    /** @type {number} Zoom. */
    this.iZoom = 9;

    /** @type {L.Map} LeafLet Map. */
    this.oMap = null;

    /** @type {L.markerClusterGroup} Leaflet markerClusterGroup. */
    this.oMarkerCluster = null;

    /** @type {object[]} Markers in MarkerCluster. */
    this.aoMarkers = [];

    /** @type {object} Default Map config. */
    this.oMapConfig = {
        src:         'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a>',
        minZoom:     8,
        maxZoom:     12
    };

    /** @type {object} Default Marker config. Additional config: popupContent(string), popupOnHover(boolean). */
    this.oMarkerConfig = {
        popupContent: '',
        popupOnHover: true
    };

    /** @type {object} Default MarkerCluster config. */
    this.oMarkerClusterConfig = {
        spiderfyOnMaxZoom:   true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true
    };

    /** @type {object} Marker icon config. Do not use iconUrl... Use iconPath and iconFile instead. */
    this.oMarkerIconConfig = {
        iconPath:    'leaflet/images/',
        iconFile:    'marker-icon.png',
        iconSize:    [25, 41],      // [Width, Height]
        iconAnchor:  [12.5, 41],    // [Lng (0:toWest, 50:toEast), Lat(0:toSouth, 50:toNorth)]
        popupAnchor: [0, -41]       // [Lng (0:toWest, 50:toEast), Lat(50:toSouth, -50:toNorth)]
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Init                                                       **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Initialize.
     * @param sMapElementId {string} Element id.
     * @return {Map}
     */
    this.init = function () {
        Egf.Cl.log(arguments);

        this.oMap = new L.Map(this.sElementId);

        this.oMap.addLayer(new L.TileLayer(this.oMapConfig.src, {
            attribution: this.oMapConfig.attribution,
            minZoom:     this.oMapConfig.minZoom,
            maxZoom:     this.oMapConfig.maxZoom
        }));

        this.refreshView();

        this.oMarkerCluster = L.markerClusterGroup(this.oMarkerClusterConfig);
        this.oMap.addLayer(this.oMarkerCluster);

        return this;
    };

    /**
     * Set container element id.
     * @param sElementId {string}
     * @return {Map}
     */
    this.setElementId = function (sElementId) {
        Egf.Cl.log(arguments);

        this.sElementId = sElementId;

        return this;
    };

    /**
     * Set Map config.
     * @param {object} oMapConfig
     * @return {Map}
     */
    this.setMapConfig = function (oMapConfig) {
        Egf.Cl.log(arguments);

        if (!this.oMap) {
            this.oMapConfig = Object.assign(this.oMapConfig, oMapConfig);
        }
        else {
            Egf.Cl.warn('Map.setMapConfig() was called after Map.init()!');
        }

        return this;
    };

    /**
     * Set Marker config.
     * @param oMarkerConfig {object}
     * @return {Map}
     */
    this.setMarkerConfig = function (oMarkerConfig) {
        Egf.Cl.log(arguments);

        if (!this.oMap) {
            this.oMarkerConfig = Object.assign(this.oMarkerConfig, oMarkerConfig);
        }
        else {
            Egf.Cl.warn('Map.setMarkerConfig() was called after Map.init()!');
        }

        return this;
    };

    /**
     * Set MarkerCluster config.
     * @param oMarkerClusterConfig {object}
     * @returns {Map}
     */
    this.setMarkerClusterConfig = function (oMarkerClusterConfig) {
        Egf.Cl.log(arguments);

        if (!this.oMap) {
            this.oMarkerClusterConfig = Object.assign(this.oMarkerClusterConfig, oMarkerClusterConfig);
        }
        else {
            Egf.Cl.warn('Map.setMarkerClusterConfig() was called after Map.init()!');
        }

        return this;
    };

    /**
     * Set MarkerIcon config
     * @param oMarkerIconConfig {object}
     */
    this.setMarkerIconConfig = function (oMarkerIconConfig) {
        Egf.Cl.log(arguments);

        if (!this.oMap) {
            this.oMarkerIconConfig = Object.assign(this.oMarkerIconConfig, oMarkerIconConfig);
        }
        else {
            Egf.Cl.warn('Map.setMarkerIconConfig() was called after Map.init()!');
        }

        return this;
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Map view                                                   **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Refresh the map.
     * @return {Map}
     */
    this.refreshView = function () {
        Egf.Cl.log(arguments);

        this.oMap.setView(new L.LatLng(this.fLat, this.fLng), this.iZoom);

        return this;
    };

    /**
     * Set zoom.
     * @param iZoom {number}
     * @return {Map}
     */
    this.setZoom = function (iZoom) {
        Egf.Cl.log(arguments);

        this.iZoom = iZoom;

        return this;
    };

    /**
     * Jump to coordinates.
     * @param fLat {number}
     * @param fLng {number}
     * @return {Map}
     */
    this.setView = function (fLat, fLng) {
        Egf.Cl.log(arguments);

        this.fLat = fLat;
        this.fLng = fLng;

        return this;
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Markers                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Add a marker to the map.
     * @param fLat {number}
     * @param fLng {number}
     * @param oMarkerConfig {object} Marker config. Has popupContent and popupOnHover properties.
     * @param oMarkerIconConfig {object} MarkerIcon config. Has iconPath and iconFile properties.
     * @return {Map}
     */
    this.addMarker = function (fLat, fLng, oMarkerConfig, oMarkerIconConfig) {
        // Egf.Cl.log(arguments);

        var oMarker = this.newMarker(fLat, fLng, oMarkerConfig, oMarkerIconConfig);
        if (oMarkerConfig && oMarkerConfig.hasOwnProperty('id') && oMarkerConfig.id) {
            this.aoMarkers[oMarkerConfig.id] = oMarker;
        } else {
            this.aoMarkers.push(oMarker);
        }
        this.oMarkerCluster.addLayer(oMarker);

        return this;
    };

    /**
     * Remove markers from Map.
     * @return {Map}
     */
    this.removeMarkers = function () {
        Egf.Cl.log(arguments);

        for (var i = 0; i < this.aoMarkers.length; i++) {
            this.oMarkerCluster.removeLayer(this.aoMarkers[i]);
        }
        this.aoMarkers = [];

        return this;
    };

    /**
     * It creates a L.Marker object, but doesn't give it to the map. Use addMarker to do that.
     * @param fLat {number}
     * @param fLng {number}
     * @param oMarkerConfig {object} Marker config. Has popupContent and popupOnHover properties.
     * @param oMarkerIconConfig {object} MarkerIcon config. Has iconPath and iconFile properties.
     * @return {L.Marker}
     */
    this.newMarker = function (fLat, fLng, oMarkerConfig, oMarkerIconConfig) {
        // Leaflet Marker config.
        oMarkerConfig     = Object.assign({}, this.oMarkerConfig, oMarkerConfig);
        // Leaflet Icon config.
        oMarkerIconConfig = Object.assign({}, this.oMarkerIconConfig, oMarkerIconConfig);
        // Leaflet MarkerIcon config.
        oMarkerConfig.icon = this.newIcon(oMarkerIconConfig);

        // New Leaflet Marker object.
        var oMarker = L.marker([fLat, fLng], oMarkerConfig);

        // Add popup to Marker.
        this.markerAddPopup(oMarker, oMarkerConfig);
        // add custom event functions to Marker.
        this.markerAddCustomFunctions(oMarker, oMarkerConfig);

        // Change icon if it has hoverIconSomething property.
        if (this.iconHasHover(oMarkerIconConfig)) {
            this.markerAddHoverIcon(oMarker, oMarkerIconConfig);
        }

        return oMarker;
    };

    /**
     * Gives back an L.Icon object. Do not set iconUrl property... it's overwritten by iconPath and iconFile.
     * @param oMarkerIconConfig {object}
     * @return {L.Icon}
     * @todo shadow http://leafletjs.com/examples/custom-icons/
     */
    this.newIcon = function (oMarkerIconConfig) {
        oMarkerIconConfig.iconUrl = oMarkerIconConfig.iconPath + oMarkerIconConfig.iconFile;

        return new L.icon(oMarkerIconConfig);
    };

    /**
     * Add popup to Marker. Marker config has to has popupContent property.
     * @param oMarker {object}
     * @param oMarkerConfig {object}
     * @return {Map}
     */
    this.markerAddPopup = function (oMarker, oMarkerConfig) {
        if (oMarkerConfig.popupContent.length) {
            oMarker.bindPopup(oMarkerConfig.popupContent);

            if (oMarkerConfig.popupOnHover) {
                oMarker
                    .on('mouseover', function (e) {
                        this.openPopup();
                    })
                    .on('mouseout', function (e) {
                        this.closePopup();
                    });
            }
        }

        return this;
    };

    /**
     * Add custom event functions to markers.
     * @param oMarker {object}
     * @param oMarkerConfig {object}
     */
    this.markerAddCustomFunctions = function (oMarker, oMarkerConfig) {
        if (oMarkerConfig.customFunctions) {
            for (var sEvent in oMarkerConfig.customFunctions) {
                if (oMarkerConfig.customFunctions.hasOwnProperty(sEvent)) {
                    if (typeof oMarkerConfig.customFunctions[sEvent] === 'function') {
                        oMarker.on(sEvent, oMarkerConfig.customFunctions[sEvent]);
                    }
                }
            }
        }
    };

    /**
     * Check if a Marker Icon has hover property.
     * @param oMarkerIconConfig {object}
     * @return {boolean}
     */
    this.iconHasHover = function (oMarkerIconConfig) {
        for (var sProp in oMarkerIconConfig) {
            if (oMarkerIconConfig.hasOwnProperty(sProp) && Egf.Util.startsWith(sProp, 'hover')) {
                return true
            }
        }

        return false;
    };

    /**
     * Change Marker Icon on hover.
     * Replace an Icon property by its hover version. For example: iconFile will be replaced if there is a hoverIconFile property.
     * @param oMarker {object}
     * @param oMarkerIconConfig {object}
     * @return {Map}
     */
    this.markerAddHoverIcon = function (oMarker, oMarkerIconConfig) {
        var that = this;

        oMarker
            .on('mouseover', function (event) {
                var oHoverIcon = Object.assign({}, oMarkerIconConfig);
                for (var sProp in oMarkerIconConfig) {
                    if (oMarkerIconConfig.hasOwnProperty(sProp) && Egf.Util.startsWith(sProp, 'hover')) {
                        var sPropWithoutHover = Egf.Util.lcfirst(sProp.substring('hover'.length));
                        oHoverIcon[sPropWithoutHover] = oMarkerIconConfig[sProp];
                    }
                }
                event.target.setIcon(that.newIcon(oHoverIcon));
            })
            .on('mouseout', function (event) {
                event.target.setIcon(that.newIcon(oMarkerIconConfig));
            });

        return this;
    };

};

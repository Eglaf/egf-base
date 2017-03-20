"use strict";

/**
 * Namespace.
 * @todo Another repo...
 */
var Egf = {};

/**
 * Util service ith some common functions.
 */
Egf.Util = new function () {

    /**
     * Variable to boolean.
     * @param xVar {mixed}
     * @return {boolean}
     */
    this.boolVal = function (xVar) {
        return !(xVar === false || xVar === 0 || xVar === 0.0 || xVar === '' || xVar === '0' || (Array.isArray(xVar) && xVar.length === 0) || xVar === null || xVar === undefined);
    };

    /**
     * Add default value to variable if is undefined and gives back that.
     * @param xVar {number|string|boolean|object|null}
     * @param xDef {number|string|boolean|object|null}
     * @return {number|string|boolean|object|null}
     */
    this.default = function (xVar, xDef) {
        return (typeof xVar === "undefined" ? xDef : xVar);
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Number                                                     **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Check if a variable is a natural number.
     * @param xVar {number|string} The variable to check.
     * @param bTypeCheck {boolean} Decide if check type too. Default false.
     * @return {boolean} True if natural number.
     */
    this.isNaturalNumber = function (xVar, bTypeCheck) {
        bTypeCheck = this.default(bTypeCheck, false);

        if (!bTypeCheck && typeof xVar === 'string') {
            xVar = Number(xVar);
        }

        return (typeof xVar === 'number') && (xVar % 1 === 0) && (xVar > 0);
    };

    /**
     * Get random float.
     * @param min {number}
     * @param max {number}
     * @return {float}
     */
    this.getRandomFloat = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    /**
     * Get random integer.
     * @param min {number}
     * @param max {number}
     * @return {number}
     */
    this.getRandomInteger = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * String                                                     **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Capitalize string.
     * @param str {string}
     * @return {string}
     */
    this.ucfirst = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    /**
     * Lowercase first character.
     * @param str
     * @return {string}
     */
    this.lcfirst = function (str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    };

    /**
     * Adds leading zero to date values. Useful with months and days.
     * @param iDate {number}
     * @param iRepeat {number}
     * @return {string}
     */
    this.withLeadingZero = function (iDate, iRepeat) {
        iRepeat = this.default(iRepeat, 2);
        return String("0".repeat(iRepeat) + iDate).slice(-iRepeat);
    };

    /**
     * Check if the strign starts with a string. Similar to String.startsWith(), but works with older browsers.
     * @param {string} sThere Search in there.
     * @param {string} sThat Search that.
     * @param {number} iPosition Search from.
     * @return {boolean} True if found.
     */
    this.startsWith = function (sThere, sThat, iPosition) {
        return sThere.substr(this.default(iPosition, 0), sThat.length) === sThat;
    };

    /**
     * Trim special characters from string. Only one char.
     * @param sInput {string}
     * @param char {string}
     * @returns {string}
     */
    this.trimChars = function (sInput, char) {
        var str = sInput.trim();

        var checkCharCount = function (side) {
            var inner_str = (side == "left") ? str : str.split("").reverse().join(""),
                count = 0;

            for (var i = 0, len = inner_str.length; i < len; i++) {
                if (inner_str[i] !== char) {
                    break;
                }
                count++;
            }
            return (side == "left") ? count : (-count - 1);
        };

        if (typeof char === "string" && str.indexOf(char) === 0 && str.lastIndexOf(char, -1) === 0) {
            str = str.slice(checkCharCount("left"), checkCharCount("right")).trim();
        }

        return str;
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Array/Object                                               **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Clone object.
     * @param oVar {object}
     * @return {object}
     */
    this.clone = function (oVar) {
        if (oVar === null || typeof oVar !== 'object') {
            return oVar;
        }
        var oTemp = oVar.constructor(); // give temp the original obj's constructor
        for (var sKey in oVar) {
            if (oVar.hasOwnProperty(sKey)) {
                oTemp[sKey] = this.clone(oVar[sKey]);
            }
        }
        return oTemp;
    };

    /**
     * Turn object into an array/
     * @param oVar {object}
     * @return {Array}
     */
    this.objectToArray = function (oVar) {
        var aVar = [];
        for (var sProp in oVar) {
            aVar.push(oVar[sProp]);
        }
        return aVar;
    };

    /**
     * Get the number of properties of an object.
     * @param oVar {object}
     * @return {number}
     */
    this.getObjectSize = function (oVar) {
        var iSize = 0;
        for (var sProperty in oVar) {
            if (oVar.hasOwnProperty(sProperty)) {
                iSize++;
            }
        }
        return iSize;
    };

    /**
     * Add event to an element.
     * @param xElement {string|HTMLElement} Element id or HtmlElement object.
     * @param sEvent {string} Event name. Click, mouseover, mouseout, etc.
     * @param fListener {function} Event listener function.
     */
    this.elementEvent = function (xElement, sEvent, fListener) {
        var eElement = (typeof xElement === 'string' ? document.getElementById(xElement) : xElement);

        if (eElement instanceof HTMLElement) {
            if (typeof fListener === 'function') {
                eElement.addEventListener(sEvent, fListener);
            } else {
                throw new Error('The util.elementEvent() third parameter has to be function!');
            }
        } else {
            throw new Error('The util.elementEvent() first parameter has to be an element id or a HtmlElement!');
        }
    };

    /**
     * Add event to elements array.
     * @param xElements {string|HTMLCollection|NodeList} Css class name or a HtmlCollection object.
     * @param sEvent {string} Event name. Click, mouseover, mouseout, etc.
     * @param fListener {function} Event listener function.
     */
    this.elementsEvent = function (xElements, sEvent, fListener) {
        var aElements = (typeof xElements === 'string' ? document.getElementsByClassName(xElements) : xElements);

        if (aElements instanceof HTMLCollection) {
            if (typeof fListener === 'function') {
                for (var i = 0; i < aElements.length; i++) {
                    aElements[i].addEventListener(sEvent, fListener);
                }
            } else {
                throw new Error('The util.elementsEvent() third parameter has to be function!');
            }
        } else {
            throw new Error('The util.elementsEvent() first parameter has to be a css class name or a HtmlCollection!');
        }
    };

    /**
     * Check if a key exists in an ar... object.
     * @param oVar {object}
     * @param sKey {string}
     * @returns {boolean}
     */
    this.arrayKeyExists = function (oVar, sKey) {
        return (typeof oVar[sKey] !== "undefined");
    };

    /**
     * Check if a value is in array or not.
     * @param aHaystack {Array}
     * @param xNeedle {mixed}
     * @param bTypeCheck {boolean}
     * @return {boolean}
     */
    this.isInArray = function (aHaystack, xNeedle, bTypeCheck) {
        bTypeCheck = this.default(bTypeCheck, false);
        var bResult = false;
        for (var i = 0; i < aHaystack.length; i++) {
            if (bTypeCheck) {
                bResult = (xNeedle === aHaystack[i] ? true : bResult);
            }
            else {
                bResult = (xNeedle == aHaystack[i] ? true : bResult);
            }
        }

        return bResult;
    };

    /**
     * Remove an element from an array by its index.
     * @param aVars {Array}
     * @param iIndex {mixed}
     * @return {boolean}
     */
    this.removeFromArrayByKey = function (aVars, iIndex) {
        if (iIndex !== -1) {
            aVars.splice(iIndex, 1);
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Remove an element from an array by its value.
     * @param aVars {Array}
     * @param xElement {mixed}
     * @returns {boolean}
     */
    this.removeFromArrayByValue = function (aVars, xElement) {
        return this.removeFromArrayByKey(aVars, aVars.indexOf(xElement));
    };

    /**
     * Find one element in array of objects by the id property of the iterated objects.
     * @param aoThese {object[]} Objects.
     * @param iVal {number} Searched value.
     * @return {object|null} Found element or null.
     */
    this.findOneInArrayOfObjectsById = function (aoThese, iVal) {
        return this.findOneInArrayOfObjectsBy(aoThese, 'id', iVal);
    };

    /**
     * Find one element in array of objects by the given key property of the iterated objects.
     * @param aoThese {object[]} Objects.
     * @param sProperty {string} Property of object.
     * @param xVal {number|string} Searched value.
     * @return {object|null}
     */
    this.findOneInArrayOfObjectsBy = function (aoThese, sProperty, xVal) {
        var oResult = null;
        aoThese.forEach(function (oThat) {
            if (oThat.hasOwnProperty(sProperty) && oThat[sProperty] == xVal) {
                oResult = oThat;
            }
        });
        return oResult;
    };

    /**
     * Find elements in array of objects by the given key property of the iterated objects.
     * @param aoThese {object[]} Objects.
     * @param sProperty {string} Property of object.
     * @param xVal {number|string} Searched value.
     * @returns {Array} Objects with that property value.
     */
    this.findInArrayOfObjectsBy = function (aoThese, sProperty, xVal) {
        var aResults = [];
        aoThese.forEach(function (oThat) {
            if (oThat.hasOwnProperty(sProperty) && oThat[sProperty] == xVal) {
                aResults.push(oThat);
            }
        });
        return aResults;
    };

    /**
     * Sort objects of array.
     * @param aObjects {Array} Objects.
     * @param sProp {string} Property.
     * @param bReverse {boolean} Desc instead. Default null.
     */
    this.sortObjects = function (aObjects, sProp, bReverse) {
        bReverse = this.default(bReverse, false);

        aObjects.sort(function (a, b) {
            if (a[sProp] < b[sProp]) {
                return (bReverse ? 1 : -1);
            } else if (a[sProp] > b[sProp]) {
                return (bReverse ? -1 : 1);
            }
            return 0;
        });
    };

};

/**
 * Console service.
 *
 * Egf.Cl
 *      .enableDebug()
 *      .enableAdvancedDebug();
 * Egf.Cl.debug("Look at that...");
 *
 * @todo Real errors in ajax callback functions are not in their real places... do something about that...
 */
Egf.Cl = new function () {

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Config                                                     **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /** @type sJsDir {string} Path to javaScripts. */
    this.sJsDir = '/js';

    /** @type bShowDebug {boolean} Show log, debug. */
    this.bShowDebug = false;

    /** @type bAdvancedDebug {boolean} Hide unnecessary information, but uses setTimeout so real error messages will be in the beginning. */
    this.bAdvancedDebug = false;

    /** @type aoToggleVars {object[]} Object variables in log. */
    this.aoToggleVars = [];

    /**
     * Set the path to javaScript root directory.
     * @param sJsDir {string}
     */
    this.setJsDir = function (sJsDir) {
        if (sJsDir.charAt(0) !== '/') {
            sJsDir = '/' + sJsDir;
        }
        this.sJsDir = sJsDir;

        return this;
    };

    /**
     * Enable debugging.
     */
    this.enableDebug = function () {
        this.bShowDebug = true;

        return this;
    };

    /**
     * Enable advanced debug, where unnecessary information is hidden.
     * It uses setTimeout so real error messages are in the beginning of the log.
     */
    this.enableAdvancedDebug = function () {
        this.bAdvancedDebug = true;

        return this;
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Error, warning, info, debug messages                       **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Show console error.
     * @param s {string}
     * @return {Egf.Cl}
     */
    this.error = function (s) {
        if (this.isFireFox()) {
            console.error(s);
        } else {
            if (this.bAdvancedDebug) {
                setTimeout(console.error.bind(console, '%c' + this.getFileLine(), 'color: #666', s), 0);
            } else {
                console.error('%c' + this.getFileLine(), 'color: #666', s);
            }
        }

        return this;
    };

    /**
     * Show console warning.
     * @param s {string}
     * @return {Egf.Cl}
     */
    this.warn = function (s) {
        if (this.isFireFox()) {
            console.warn(s);
        } else {
            if (this.bAdvancedDebug) {
                setTimeout(console.warn.bind(console, '%c' + this.getFileLine(), 'color: #666', s), 0);
            } else {
                console.warn('%c' + this.getFileLine(), 'color: #666', s);
            }
        }

        return this;
    };

    /**
     * Show console info, if debug is true.
     * @param s {string}
     * @return {Egf.Cl}
     */
    this.info = function (s) {
        if (this.isFireFox()) {
            console.info(s);
        } else {
            if (this.bAdvancedDebug) {
                setTimeout(console.info.bind(console, '%c' + this.getFileLine(), 'color: #666', s), 0);
            } else {
                console.info('%c' + this.getFileLine(), 'color: #666', s);
            }
        }

        return this;
    };

    /**
     * Show console debug, if debug is true.
     * @param s {string}
     * @return {Egf.Cl}
     */
    this.debug = function (s) {
        if (this.bShowDebug) {
            if (this.isFireFox()) {
                console.debug(s);
            } else {
                if (this.bAdvancedDebug) {
                    setTimeout(console.debug.bind(console, '%c' + this.getFileLine(), 'color: #666', s), 0);
                } else {
                    console.debug('%c' + this.getFileLine(), 'color: #666', s);
                }
            }
        }

        return this;
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Log messages                                               **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Special log method. Gives back the file, line and function with parameters.
     * Use as: cl.log(arguments);
     * @param arguments {arguments} Arguments of caller function.
     * @return {Egf.Cl}
     */
    this.log = function (/***/) {
        if (this.bShowDebug) {
            if (this.isFireFox()) {
                // Warn user about the FireFox problem, but only once.
                if (this.bAdvancedDebug) {
                    console.error('The cl.log() doesn\'t work in FireFox... sorry about that.');
                    this.bAdvancedDebug = false;
                }
            }
            else {
                if (this.bAdvancedDebug) {
                    setTimeout(console.log.bind(console, '%c' + this.getFileLine(), 'color: #666;', this.getLog(arguments)), 0);
                    if (this.aoToggleVars) {
                        this.aoToggleVars.forEach(function (oVar) {
                            setTimeout(console.log.bind(console, oVar), 0);
                        });
                        this.aoToggleVars = [];
                    }
                } else {
                    console.log('%c' + this.getFileLine() + ' ' + this.getLog(arguments), 'color: #666');
                    if (this.aoToggleVars) {
                        this.aoToggleVars.forEach(function (oVar) {
                            console.log(oVar);
                        });
                        this.aoToggleVars = [];
                    }
                }
            }
        }

        return this;
    };

    /**
     * The content of the log method.
     * @param oArguments {object} The arguments of the log method.
     * @return {string}
     */
    this.getLog = function (oArguments) {
        var that = this;
        var aParams = [];
        Egf.Util.objectToArray(oArguments).forEach(function (oArg) {
            if (typeof oArg === 'object') {
                Egf.Util.objectToArray(oArg).forEach(function (xElem) {
                    if (typeof xElem === 'undefined') {
                        xElem = 'undefined';
                    } else if (typeof xElem === 'string') {
                        xElem = '"' + xElem + '"';
                    } else if (typeof xElem === 'object') {
                        that.aoToggleVars.push(xElem);
                        xElem = '{Object:' + Egf.Util.getObjectSize(xElem) + '}';
                    } else if (typeof xElem === 'function') {
                        // that.aoToggleVars.push(xElem);
                        xElem = '{Function}';
                    }
                    aParams.push(xElem);
                });
            }
            // Not arguments passed.
            else {
                throw new Error('The cl.log(arguments) parameter has to be the arguments of the logged function. Got ' + typeof oArg + ' instead! ');
            }
        });

        var sCallerLine = this.getErrorObject().stack.split("\n")[4];
        var sFunc = sCallerLine.trim().split(' ')[1];
        var sParams = '(' + aParams.join(', ') + ')';

        if (sFunc === 'HTMLDocument.<anonymous>') {
            sFunc = '';
        }

        return sFunc + sParams;
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * FileLine                                                   **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * It gives back the file and line information of caller javascript.
     * @return {string}
     */
    this.getFileLine = function () {
        var sCallerLine = this.getErrorObject().stack.split("\n")[4];
        var sClean = sCallerLine.slice(sCallerLine.indexOf(this.sJsDir) + 4, sCallerLine.length);
        var sFileLineCol = sClean.substring(0, sClean.length - 1);
        var sFileLine = sFileLineCol.slice(0, -(sFileLineCol.split(':')[2]).length - 1);

        return sFileLine + '\n';
    };

    /**
     * Get an error object to subtract the file and line from it.
     * @return {Error}
     */
    this.getErrorObject = function () {
        try {
            throw Error('')
        } catch (err) {
            return err;
        }
    };

    /**
     * Check if the browser is FireFox or not.
     * @return {boolean}
     */
    this.isFireFox = function () {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    };

};

/**
 * Ajax service.
 *
 * @todo headers
 */
Egf.Ajax = new function () {

    /**
     * Get request.
     * @param sUrl {string}
     * @param oData {object}
     * @param fSuccess {function}
     * @param fError {function}
     */
    this.get = function (sUrl, oData, fSuccess, fError) {
        var aQuery = [];
        for (var sKey in oData) {
            if (oData.hasOwnProperty(sKey)) {
                aQuery.push(encodeURIComponent(sKey) + '=' + encodeURIComponent(oData[sKey]));
            }
        }

        this.request(sUrl + (aQuery.length ? '?' + aQuery.join('&') : ''), 'GET', '', fSuccess, fError);
    };

    /**
     * Post request.
     * @param sUrl {string}
     * @param oData {object}
     * @param fSuccess {function}
     * @param fError {function}
     * @todo Test sent data...
     */
    this.post = function (sUrl, oData, fSuccess, fError) {
        /*var aQuery = [];
        for (var sKey in oData) {
            if (oData.hasOwnProperty(sKey)) {
                aQuery.push(encodeURIComponent(sKey) + '=' + encodeURIComponent(oData[sKey]));
            }
        }*/

        this.request(sUrl, 'POST', JSON.stringify(oData), fSuccess, fError);
        // this.request(sUrl, 'POST', aQuery.join('&'), fSuccess, fError);
    };

    /**
     * Send Ajax request.
     * @param sUrl {string}
     * @param sMethod {string}
     * @param sData {string}
     * @param fSuccess {function}
     * @param fError {function}
     */
    this.request = function (sUrl, sMethod, sData, fSuccess, fError) {
        Egf.Cl.log(arguments);

        var oRequest = this.getXhr();

        oRequest.open(sMethod, sUrl);
        oRequest.onreadystatechange = function () {
            if (oRequest.readyState == 4) {
                // Success.
                if (oRequest.status == 200) {
                    if (typeof fSuccess === 'function') {
                        // Json.
                        if (oRequest.getResponseHeader('content-type') === 'application/json') {
                            fSuccess(JSON.parse(oRequest.responseText));
                        }
                        // String.
                        else {
                            fSuccess(oRequest.response);
                        }
                    }
                }
                // Error.
                else {
                    Egf.Cl.warn('Ajax ' + sMethod + ' request error! \n URL: ' + sUrl);
                    if (typeof fError === 'function') {
                        // Json.
                        if (oRequest.getResponseHeader('content-type') === 'application/json') {
                            fError(JSON.parse(oRequest.responseText));
                        }
                        // String.
                        else {
                            fError(oRequest.responseText);
                        }
                    }
                }
            }
        };

        if (sMethod == 'POST') {
            oRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }

        oRequest.send(sData);
    };

    /**
     * It gives back a XmlHttpRequest.
     * @return {XMLHttpRequest}
     */
    this.getXhr = function () {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();
        }

        var aVersions = [
            'MSXML2.XmlHttp.6.0',
            'MSXML2.XmlHttp.5.0',
            'MSXML2.XmlHttp.4.0',
            'MSXML2.XmlHttp.3.0',
            'MSXML2.XmlHttp.2.0',
            'Microsoft.XmlHttp'
        ];

        for (var i = 0; i < aVersions.length; i++) {
            try {
                return new ActiveXObject(aVersions[i]);
                break;
            } catch (e) {
            }
        }
    };

};

"use strict";

/**
 * Namespace.
 */
var Egf = {};

/**
 * Util service ith some common functions.
 */
Egf.Util = new function () {

    /**
     * Variable to boolean.
     * @param xVar {mixed|string|number|boolean}
     * @return {boolean}
     */
    this.boolVal = function (xVar) {
        return !(xVar === false || xVar === 0 || xVar === 0.0 || xVar === '' || xVar === '0' || (Array.isArray(xVar) && xVar.length === 0) || xVar === null || xVar === undefined);
    };

    /**
     * Add default value to variable if is undefined and gives back that.
     * @param xVar {number|string|boolean|Object|Array|null}
     * @param xDef {number|string|boolean|Object|Array|null}
     * @return {number|string|boolean|Object|Array|null}
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
     * @param [bTypeCheck] {boolean} Decide if check type too. Default false.
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
     * Check if the string starts with a string. Similar to String.startsWith(), but works with older browsers.
     * @param {string} sThere Search in there.
     * @param {string} sThat Search that.
     * @return {boolean} True if found.
     */
    this.startsWith = function (sThere, sThat) {
        return sThere.substr(0, sThat.length) === sThat;
    };

    /**
     * Trim characters from the string.
     * @param sInput {string} String to trim.
     * @param [sCharacters] {string} Characters to trim.
     * @return {string} Trimmed string.
     */
    this.trim = function (sInput, sCharacters) {
        sCharacters = this.default(sCharacters, ' ');

        if (typeof sInput !== "string" || typeof sCharacters !== "string") {
            throw new TypeError("argument must be string");
        }

        sCharacters = sCharacters.replace(/[\[\](){}?*+\^$\\.|\-]/g, "\\$&");

        return sInput.replace(new RegExp("^[" + sCharacters + "]+|[" + sCharacters + "]+$", "g"), '');
    };

    /**
     * Add leading zero (or other character) to a number or string.
     * @param xNum {number|string} variable that need leading zeros.
     * @param iWidth {number} The length of result string.
     * @param [sLeading] {string} The leading characters to add.
     * @return {string} Zero leaded string.
     */
    this.addLeadingZero = function (xNum, iWidth, sLeading) {
        sLeading = Egf.Util.default(sLeading, '0');
        xNum     = xNum + '';

        return xNum.length >= iWidth ? xNum : new Array(iWidth - xNum.length + 1).join(sLeading) + xNum;
    };

    /**
     * Formatting dates. The format expects a very similar structure to PHP DateTime format.
     * The regex backslash exceptions are different... Instead of "\M" it needs "\\M" to have a capitalized "M" in the string instead of the month name.
     * Todo finish it or fix it...
     * @param sFormat {string} Format of date... Same structure as in PHP... but not all of it.
     * @param [oDate] {Date|Object} Date object.
     * @param [aMonths] {Array} Overwrite the default months array.
     * @param [aDays] {Array} Overwrite the default days array.
     * @return {string} Formatted date.
     */
    this.getFormattedDate = function (sFormat, oDate, aMonths, aDays) {
        sFormat = ' ' + Egf.Util.default(sFormat, 'Y-m-d H:i:s') + ' ';
        oDate   = Egf.Util.default(oDate, new Date());
        aMonths = Egf.Util.default(aMonths, ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
        aDays   = Egf.Util.default(aDays, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

        var sResult = sFormat;

        // Year
        sResult = sResult.replace('Y', oDate.getFullYear()); // 1980..2037
        sResult = sResult.replace('y', (oDate.getFullYear() + '').substring(2)); // 80..37
        // Month
        sResult = sResult.replace('m', this.addLeadingZero(oDate.getMonth() + 1, 2)); // 01..12
        sResult = sResult.replace('n', oDate.getMonth() + 1); // 1..12
        sResult = sResult.replace('t', (new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0).getDate())); // 28..31 (Days in month)
        // Day
        sResult = sResult.replace('d', this.addLeadingZero(oDate.getDate(), 2)); // 01..31
        sResult = sResult.replace('j', oDate.getDate()); // 1..31
        // Hour
        sResult = sResult.replace('G', oDate.getHours()); // 0..23
        sResult = sResult.replace('H', this.addLeadingZero(oDate.getHours(), 2)); // 00..23
        // Hour (ugly format)
        sResult = sResult.replace('g', (oDate.getHours() > 12 ? oDate.getHours() - 12 : oDate.getHours())); // 1..12
        sResult = sResult.replace('h', this.addLeadingZero((oDate.getHours() > 12 ? oDate.getHours() - 12 : oDate.getHours()), 2)); // 01..12
        sResult = sResult.replace('a', (oDate.getHours() > 12 ? 'am' : 'pm')); // am,pm
        sResult = sResult.replace('A', (oDate.getHours() > 12 ? 'A\\M' : 'P\\M')); // AM,PM
        // Minute
        sResult = sResult.replace('i', this.addLeadingZero(oDate.getMinutes(), 2)); // 00..59
        // Second
        sResult = sResult.replace('s', this.addLeadingZero(oDate.getSeconds(), 2)); // 00..59

        // Months as string.
        if (aMonths.length == 12) { // todo ... better way or to all...
            sResult = sResult.replace(/F/g, function (rpl, pos, s) {
                return (s[pos - 1] == '\\' ? rpl : aMonths[oDate.getMonth()])
            }); // January..December
            sResult = sResult.replace(/M/g, function (rpl, pos, s) {
                return (s[pos - 1] == '\\' ? rpl : aMonths[oDate.getMonth()].substring(0, 3));
            }); // Jan..Dec
        }
        // Days as string.
        if (aDays.length == 7) {
            var iDay = (oDate.getDay() > 0 ? oDate.getDay() : 7);
            sResult  = sResult.replace(' l ', ' ' + aDays[iDay - 1] + ' ');  // Monday..Sunday (That's a lowercase "L" there)
            sResult  = sResult.replace(' D ', ' ' + aDays[iDay - 1].substring(0, 3) + ' '); // Mon..Sun
            sResult  = sResult.replace(' N ', ' ' + iDay + ' ');
        }

        return sResult.replace(/\\/g, "").trim();
    };

    /**
     * Truncate string to length.
     * @param sString {string} The input string to truncate.
     * @param iMaxLength {number}  Max length of string.
     * @param [sPostFix] {string} Add postfix string.
     * @param [sTrimChars] {string} Trim characters from the string before it adds the postfix string.
     * @return {string} Truncated string if it was longer than max.
     */
    this.truncateToLength = function (sString, iMaxLength, sPostFix, sTrimChars) {
        sTrimChars = this.default(sTrimChars, ' ,-_');
        sPostFix   = this.default(sPostFix, '...');

        if (sString.length <= iMaxLength) {
            return sString;
        }

        return this.trim(sString.substr(0, sString.lastIndexOf(' ', iMaxLength)), sTrimChars) + sPostFix;
    };

    /**
     * Strip tags from a string.
     * @param input {string} String with tags.
     * @param [allowed] {string} Example: "<br><br/><br /><b><i><p>"
     * @return {string} Result without or with fewer tags.
     * @url http://locutus.io/php/strings/strip_tags/
     */
    this.stripTags = function (input, allowed) {
        allowed                = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
        var tags               = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
        var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
        return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
        })
    };

    /**
     * Remove accents from a string
     * @param sText {string}
     * @url https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript Thanks Ed!
     */
    this.latinize = function (sText) {
        var oLatinizeMap = {
            "Ã":  "A",
            "Ä‚":  "A",
            "áº®": "A",
            "áº¶": "A",
            "áº°": "A",
            "áº²": "A",
            "áº´": "A",
            "Ç":  "A",
            "Ã‚":  "A",
            "áº¤": "A",
            "áº¬": "A",
            "áº¦": "A",
            "áº¨": "A",
            "áºª": "A",
            "Ã„":  "A",
            "Çž":  "A",
            "È¦":  "A",
            "Ç ":  "A",
            "áº ": "A",
            "È€":  "A",
            "Ã€":  "A",
            "áº¢": "A",
            "È‚":  "A",
            "Ä€":  "A",
            "Ä„":  "A",
            "Ã…":  "A",
            "Çº":  "A",
            "á¸€": "A",
            "Èº":  "A",
            "Ãƒ":  "A",
            "êœ²": "AA",
            "Ã†":  "AE",
            "Ç¼":  "AE",
            "Ç¢":  "AE",
            "êœ´": "AO",
            "êœ¶": "AU",
            "êœ¸": "AV",
            "êœº": "AV",
            "êœ¼": "AY",
            "á¸‚": "B",
            "á¸„": "B",
            "Æ":  "B",
            "á¸†": "B",
            "Éƒ":  "B",
            "Æ‚":  "B",
            "Ä†":  "C",
            "ÄŒ":  "C",
            "Ã‡":  "C",
            "á¸ˆ": "C",
            "Äˆ":  "C",
            "ÄŠ":  "C",
            "Æ‡":  "C",
            "È»":  "C",
            "ÄŽ":  "D",
            "á¸": "D",
            "á¸’": "D",
            "á¸Š": "D",
            "á¸Œ": "D",
            "ÆŠ":  "D",
            "á¸Ž": "D",
            "Ç²":  "D",
            "Ç…":  "D",
            "Ä":  "D",
            "Æ‹":  "D",
            "Ç±":  "DZ",
            "Ç„":  "DZ",
            "Ã‰":  "E",
            "Ä”":  "E",
            "Äš":  "E",
            "È¨":  "E",
            "á¸œ": "E",
            "ÃŠ":  "E",
            "áº¾": "E",
            "á»†": "E",
            "á»€": "E",
            "á»‚": "E",
            "á»„": "E",
            "á¸˜": "E",
            "Ã‹":  "E",
            "Ä–":  "E",
            "áº¸": "E",
            "È„":  "E",
            "Ãˆ":  "E",
            "áºº": "E",
            "È†":  "E",
            "Ä’":  "E",
            "á¸–": "E",
            "á¸”": "E",
            "Ä˜":  "E",
            "É†":  "E",
            "áº¼": "E",
            "á¸š": "E",
            "êª": "ET",
            "á¸ž": "F",
            "Æ‘":  "F",
            "Ç´":  "G",
            "Äž":  "G",
            "Ç¦":  "G",
            "Ä¢":  "G",
            "Äœ":  "G",
            "Ä ":  "G",
            "Æ“":  "G",
            "á¸ ": "G",
            "Ç¤":  "G",
            "á¸ª": "H",
            "Èž":  "H",
            "á¸¨": "H",
            "Ä¤":  "H",
            "â±§": "H",
            "á¸¦": "H",
            "á¸¢": "H",
            "á¸¤": "H",
            "Ä¦":  "H",
            "Ã":  "I",
            "Ä¬":  "I",
            "Ç":  "I",
            "ÃŽ":  "I",
            "Ã":  "I",
            "á¸®": "I",
            "Ä°":  "I",
            "á»Š": "I",
            "Èˆ":  "I",
            "ÃŒ":  "I",
            "á»ˆ": "I",
            "ÈŠ":  "I",
            "Äª":  "I",
            "Ä®":  "I",
            "Æ—":  "I",
            "Ä¨":  "I",
            "á¸¬": "I",
            "ê¹": "D",
            "ê»": "F",
            "ê½": "G",
            "êž‚": "R",
            "êž„": "S",
            "êž†": "T",
            "ê¬": "IS",
            "Ä´":  "J",
            "Éˆ":  "J",
            "á¸°": "K",
            "Ç¨":  "K",
            "Ä¶":  "K",
            "â±©": "K",
            "ê‚": "K",
            "á¸²": "K",
            "Æ˜":  "K",
            "á¸´": "K",
            "ê€": "K",
            "ê„": "K",
            "Ä¹":  "L",
            "È½":  "L",
            "Ä½":  "L",
            "Ä»":  "L",
            "á¸¼": "L",
            "á¸¶": "L",
            "á¸¸": "L",
            "â± ": "L",
            "êˆ": "L",
            "á¸º": "L",
            "Ä¿":  "L",
            "â±¢": "L",
            "Çˆ":  "L",
            "Å":  "L",
            "Ç‡":  "LJ",
            "á¸¾": "M",
            "á¹€": "M",
            "á¹‚": "M",
            "â±®": "M",
            "Åƒ":  "N",
            "Å‡":  "N",
            "Å…":  "N",
            "á¹Š": "N",
            "á¹„": "N",
            "á¹†": "N",
            "Ç¸":  "N",
            "Æ":  "N",
            "á¹ˆ": "N",
            "È ":  "N",
            "Ç‹":  "N",
            "Ã‘":  "N",
            "ÇŠ":  "NJ",
            "Ã“":  "O",
            "ÅŽ":  "O",
            "Ç‘":  "O",
            "Ã”":  "O",
            "á»": "O",
            "á»˜": "O",
            "á»’": "O",
            "á»”": "O",
            "á»–": "O",
            "Ã–":  "O",
            "Èª":  "O",
            "È®":  "O",
            "È°":  "O",
            "á»Œ": "O",
            "Å":  "O",
            "ÈŒ":  "O",
            "Ã’":  "O",
            "á»Ž": "O",
            "Æ ":  "O",
            "á»š": "O",
            "á»¢": "O",
            "á»œ": "O",
            "á»ž": "O",
            "á» ": "O",
            "ÈŽ":  "O",
            "êŠ": "O",
            "êŒ": "O",
            "ÅŒ":  "O",
            "á¹’": "O",
            "á¹": "O",
            "ÆŸ":  "O",
            "Çª":  "O",
            "Ç¬":  "O",
            "Ã˜":  "O",
            "Ç¾":  "O",
            "Ã•":  "O",
            "á¹Œ": "O",
            "á¹Ž": "O",
            "È¬":  "O",
            "Æ¢":  "OI",
            "êŽ": "OO",
            "Æ":  "E",
            "Æ†":  "O",
            "È¢":  "OU",
            "á¹”": "P",
            "á¹–": "P",
            "ê’": "P",
            "Æ¤":  "P",
            "ê”": "P",
            "â±£": "P",
            "ê": "P",
            "ê˜": "Q",
            "ê–": "Q",
            "Å”":  "R",
            "Å˜":  "R",
            "Å–":  "R",
            "á¹˜": "R",
            "á¹š": "R",
            "á¹œ": "R",
            "È":  "R",
            "È’":  "R",
            "á¹ž": "R",
            "ÉŒ":  "R",
            "â±¤": "R",
            "êœ¾": "C",
            "ÆŽ":  "E",
            "Åš":  "S",
            "á¹¤": "S",
            "Å ":  "S",
            "á¹¦": "S",
            "Åž":  "S",
            "Åœ":  "S",
            "È˜":  "S",
            "á¹ ": "S",
            "á¹¢": "S",
            "á¹¨": "S",
            "Å¤":  "T",
            "Å¢":  "T",
            "á¹°": "T",
            "Èš":  "T",
            "È¾":  "T",
            "á¹ª": "T",
            "á¹¬": "T",
            "Æ¬":  "T",
            "á¹®": "T",
            "Æ®":  "T",
            "Å¦":  "T",
            "â±¯": "A",
            "êž€": "L",
            "Æœ":  "M",
            "É…":  "V",
            "êœ¨": "TZ",
            "Ãš":  "U",
            "Å¬":  "U",
            "Ç“":  "U",
            "Ã›":  "U",
            "á¹¶": "U",
            "Ãœ":  "U",
            "Ç—":  "U",
            "Ç™":  "U",
            "Ç›":  "U",
            "Ç•":  "U",
            "á¹²": "U",
            "á»¤": "U",
            "Å°":  "U",
            "È”":  "U",
            "Ã™":  "U",
            "á»¦": "U",
            "Æ¯":  "U",
            "á»¨": "U",
            "á»°": "U",
            "á»ª": "U",
            "á»¬": "U",
            "á»®": "U",
            "È–":  "U",
            "Åª":  "U",
            "á¹º": "U",
            "Å²":  "U",
            "Å®":  "U",
            "Å¨":  "U",
            "á¹¸": "U",
            "á¹´": "U",
            "êž": "V",
            "á¹¾": "V",
            "Æ²":  "V",
            "á¹¼": "V",
            "ê ": "VY",
            "áº‚": "W",
            "Å´":  "W",
            "áº„": "W",
            "áº†": "W",
            "áºˆ": "W",
            "áº€": "W",
            "â±²": "W",
            "áºŒ": "X",
            "áºŠ": "X",
            "Ã":  "Y",
            "Å¶":  "Y",
            "Å¸":  "Y",
            "áºŽ": "Y",
            "á»´": "Y",
            "á»²": "Y",
            "Æ³":  "Y",
            "á»¶": "Y",
            "á»¾": "Y",
            "È²":  "Y",
            "ÉŽ":  "Y",
            "á»¸": "Y",
            "Å¹":  "Z",
            "Å½":  "Z",
            "áº": "Z",
            "â±«": "Z",
            "Å»":  "Z",
            "áº’": "Z",
            "È¤":  "Z",
            "áº”": "Z",
            "Æµ":  "Z",
            "Ä²":  "IJ",
            "Å’":  "OE",
            "á´€": "A",
            "á´": "AE",
            "Ê™":  "B",
            "á´ƒ": "B",
            "á´„": "C",
            "á´…": "D",
            "á´‡": "E",
            "êœ°": "F",
            "É¢":  "G",
            "Ê›":  "G",
            "Êœ":  "H",
            "Éª":  "I",
            "Ê":  "R",
            "á´Š": "J",
            "á´‹": "K",
            "ÊŸ":  "L",
            "á´Œ": "L",
            "á´": "M",
            "É´":  "N",
            "á´": "O",
            "É¶":  "OE",
            "á´": "O",
            "á´•": "OU",
            "á´˜": "P",
            "Ê€":  "R",
            "á´Ž": "N",
            "á´™": "R",
            "êœ±": "S",
            "á´›": "T",
            "â±»": "E",
            "á´š": "R",
            "á´œ": "U",
            "á´ ": "V",
            "á´¡": "W",
            "Ê":  "Y",
            "á´¢": "Z",
            "Ã¡":  "a",
            "Äƒ":  "a",
            "áº¯": "a",
            "áº·": "a",
            "áº±": "a",
            "áº³": "a",
            "áºµ": "a",
            "ÇŽ":  "a",
            "Ã¢":  "a",
            "áº¥": "a",
            "áº­": "a",
            "áº§": "a",
            "áº©": "a",
            "áº«": "a",
            "Ã¤":  "a",
            "ÇŸ":  "a",
            "È§":  "a",
            "Ç¡":  "a",
            "áº¡": "a",
            "È":  "a",
            "Ã ":  "a",
            "áº£": "a",
            "Èƒ":  "a",
            "Ä":  "a",
            "Ä…":  "a",
            "á¶": "a",
            "áºš": "a",
            "Ã¥":  "a",
            "Ç»":  "a",
            "á¸": "a",
            "â±¥": "a",
            "Ã£":  "a",
            "êœ³": "aa",
            "Ã¦":  "ae",
            "Ç½":  "ae",
            "Ç£":  "ae",
            "êœµ": "ao",
            "êœ·": "au",
            "êœ¹": "av",
            "êœ»": "av",
            "êœ½": "ay",
            "á¸ƒ": "b",
            "á¸…": "b",
            "É“":  "b",
            "á¸‡": "b",
            "áµ¬": "b",
            "á¶€": "b",
            "Æ€":  "b",
            "Æƒ":  "b",
            "Éµ":  "o",
            "Ä‡":  "c",
            "Ä":  "c",
            "Ã§":  "c",
            "á¸‰": "c",
            "Ä‰":  "c",
            "É•":  "c",
            "Ä‹":  "c",
            "Æˆ":  "c",
            "È¼":  "c",
            "Ä":  "d",
            "á¸‘": "d",
            "á¸“": "d",
            "È¡":  "d",
            "á¸‹": "d",
            "á¸": "d",
            "É—":  "d",
            "á¶‘": "d",
            "á¸": "d",
            "áµ­": "d",
            "á¶": "d",
            "Ä‘":  "d",
            "É–":  "d",
            "ÆŒ":  "d",
            "Ä±":  "i",
            "È·":  "j",
            "ÉŸ":  "j",
            "Ê„":  "j",
            "Ç³":  "dz",
            "Ç†":  "dz",
            "Ã©":  "e",
            "Ä•":  "e",
            "Ä›":  "e",
            "È©":  "e",
            "á¸": "e",
            "Ãª":  "e",
            "áº¿": "e",
            "á»‡": "e",
            "á»": "e",
            "á»ƒ": "e",
            "á»…": "e",
            "á¸™": "e",
            "Ã«":  "e",
            "Ä—":  "e",
            "áº¹": "e",
            "È…":  "e",
            "Ã¨":  "e",
            "áº»": "e",
            "È‡":  "e",
            "Ä“":  "e",
            "á¸—": "e",
            "á¸•": "e",
            "â±¸": "e",
            "Ä™":  "e",
            "á¶’": "e",
            "É‡":  "e",
            "áº½": "e",
            "á¸›": "e",
            "ê«": "et",
            "á¸Ÿ": "f",
            "Æ’":  "f",
            "áµ®": "f",
            "á¶‚": "f",
            "Çµ":  "g",
            "ÄŸ":  "g",
            "Ç§":  "g",
            "Ä£":  "g",
            "Ä":  "g",
            "Ä¡":  "g",
            "É ":  "g",
            "á¸¡": "g",
            "á¶ƒ": "g",
            "Ç¥":  "g",
            "á¸«": "h",
            "ÈŸ":  "h",
            "á¸©": "h",
            "Ä¥":  "h",
            "â±¨": "h",
            "á¸§": "h",
            "á¸£": "h",
            "á¸¥": "h",
            "É¦":  "h",
            "áº–": "h",
            "Ä§":  "h",
            "Æ•":  "hv",
            "Ã­":  "i",
            "Ä­":  "i",
            "Ç":  "i",
            "Ã®":  "i",
            "Ã¯":  "i",
            "á¸¯": "i",
            "á»‹": "i",
            "È‰":  "i",
            "Ã¬":  "i",
            "á»‰": "i",
            "È‹":  "i",
            "Ä«":  "i",
            "Ä¯":  "i",
            "á¶–": "i",
            "É¨":  "i",
            "Ä©":  "i",
            "á¸­": "i",
            "êº": "d",
            "ê¼": "f",
            "áµ¹": "g",
            "êžƒ": "r",
            "êž…": "s",
            "êž‡": "t",
            "ê­": "is",
            "Ç°":  "j",
            "Äµ":  "j",
            "Ê":  "j",
            "É‰":  "j",
            "á¸±": "k",
            "Ç©":  "k",
            "Ä·":  "k",
            "â±ª": "k",
            "êƒ": "k",
            "á¸³": "k",
            "Æ™":  "k",
            "á¸µ": "k",
            "á¶„": "k",
            "ê": "k",
            "ê…": "k",
            "Äº":  "l",
            "Æš":  "l",
            "É¬":  "l",
            "Ä¾":  "l",
            "Ä¼":  "l",
            "á¸½": "l",
            "È´":  "l",
            "á¸·": "l",
            "á¸¹": "l",
            "â±¡": "l",
            "ê‰": "l",
            "á¸»": "l",
            "Å€":  "l",
            "É«":  "l",
            "á¶…": "l",
            "É­":  "l",
            "Å‚":  "l",
            "Ç‰":  "lj",
            "Å¿":  "s",
            "áºœ": "s",
            "áº›": "s",
            "áº": "s",
            "á¸¿": "m",
            "á¹": "m",
            "á¹ƒ": "m",
            "É±":  "m",
            "áµ¯": "m",
            "á¶†": "m",
            "Å„":  "n",
            "Åˆ":  "n",
            "Å†":  "n",
            "á¹‹": "n",
            "Èµ":  "n",
            "á¹…": "n",
            "á¹‡": "n",
            "Ç¹":  "n",
            "É²":  "n",
            "á¹‰": "n",
            "Æž":  "n",
            "áµ°": "n",
            "á¶‡": "n",
            "É³":  "n",
            "Ã±":  "n",
            "ÇŒ":  "nj",
            "Ã³":  "o",
            "Å":  "o",
            "Ç’":  "o",
            "Ã´":  "o",
            "á»‘": "o",
            "á»™": "o",
            "á»“": "o",
            "á»•": "o",
            "á»—": "o",
            "Ã¶":  "o",
            "È«":  "o",
            "È¯":  "o",
            "È±":  "o",
            "á»": "o",
            "Å‘":  "o",
            "È":  "o",
            "Ã²":  "o",
            "á»": "o",
            "Æ¡":  "o",
            "á»›": "o",
            "á»£": "o",
            "á»": "o",
            "á»Ÿ": "o",
            "á»¡": "o",
            "È":  "o",
            "ê‹": "o",
            "ê": "o",
            "â±º": "o",
            "Å":  "o",
            "á¹“": "o",
            "á¹‘": "o",
            "Ç«":  "o",
            "Ç­":  "o",
            "Ã¸":  "o",
            "Ç¿":  "o",
            "Ãµ":  "o",
            "á¹": "o",
            "á¹": "o",
            "È­":  "o",
            "Æ£":  "oi",
            "ê": "oo",
            "É›":  "e",
            "á¶“": "e",
            "É”":  "o",
            "á¶—": "o",
            "È£":  "ou",
            "á¹•": "p",
            "á¹—": "p",
            "ê“": "p",
            "Æ¥":  "p",
            "áµ±": "p",
            "á¶ˆ": "p",
            "ê•": "p",
            "áµ½": "p",
            "ê‘": "p",
            "ê™": "q",
            "Ê ":  "q",
            "É‹":  "q",
            "ê—": "q",
            "Å•":  "r",
            "Å™":  "r",
            "Å—":  "r",
            "á¹™": "r",
            "á¹›": "r",
            "á¹": "r",
            "È‘":  "r",
            "É¾":  "r",
            "áµ³": "r",
            "È“":  "r",
            "á¹Ÿ": "r",
            "É¼":  "r",
            "áµ²": "r",
            "á¶‰": "r",
            "É":  "r",
            "É½":  "r",
            "â†„": "c",
            "êœ¿": "c",
            "É˜":  "e",
            "É¿":  "r",
            "Å›":  "s",
            "á¹¥": "s",
            "Å¡":  "s",
            "á¹§": "s",
            "ÅŸ":  "s",
            "Å":  "s",
            "È™":  "s",
            "á¹¡": "s",
            "á¹£": "s",
            "á¹©": "s",
            "Ê‚":  "s",
            "áµ´": "s",
            "á¶Š": "s",
            "È¿":  "s",
            "É¡":  "g",
            "á´‘": "o",
            "á´“": "o",
            "á´": "u",
            "Å¥":  "t",
            "Å£":  "t",
            "á¹±": "t",
            "È›":  "t",
            "È¶":  "t",
            "áº—": "t",
            "â±¦": "t",
            "á¹«": "t",
            "á¹­": "t",
            "Æ­":  "t",
            "á¹¯": "t",
            "áµµ": "t",
            "Æ«":  "t",
            "Êˆ":  "t",
            "Å§":  "t",
            "áµº": "th",
            "É":  "a",
            "á´‚": "ae",
            "Ç":  "e",
            "áµ·": "g",
            "É¥":  "h",
            "Ê®":  "h",
            "Ê¯":  "h",
            "á´‰": "i",
            "Êž":  "k",
            "êž": "l",
            "É¯":  "m",
            "É°":  "m",
            "á´”": "oe",
            "É¹":  "r",
            "É»":  "r",
            "Éº":  "r",
            "â±¹": "r",
            "Ê‡":  "t",
            "ÊŒ":  "v",
            "Ê":  "w",
            "ÊŽ":  "y",
            "êœ©": "tz",
            "Ãº":  "u",
            "Å­":  "u",
            "Ç”":  "u",
            "Ã»":  "u",
            "á¹·": "u",
            "Ã¼":  "u",
            "Ç˜":  "u",
            "Çš":  "u",
            "Çœ":  "u",
            "Ç–":  "u",
            "á¹³": "u",
            "á»¥": "u",
            "Å±":  "u",
            "È•":  "u",
            "Ã¹":  "u",
            "á»§": "u",
            "Æ°":  "u",
            "á»©": "u",
            "á»±": "u",
            "á»«": "u",
            "á»­": "u",
            "á»¯": "u",
            "È—":  "u",
            "Å«":  "u",
            "á¹»": "u",
            "Å³":  "u",
            "á¶™": "u",
            "Å¯":  "u",
            "Å©":  "u",
            "á¹¹": "u",
            "á¹µ": "u",
            "áµ«": "ue",
            "ê¸": "um",
            "â±´": "v",
            "êŸ": "v",
            "á¹¿": "v",
            "Ê‹":  "v",
            "á¶Œ": "v",
            "â±±": "v",
            "á¹½": "v",
            "ê¡": "vy",
            "áºƒ": "w",
            "Åµ":  "w",
            "áº…": "w",
            "áº‡": "w",
            "áº‰": "w",
            "áº": "w",
            "â±³": "w",
            "áº˜": "w",
            "áº": "x",
            "áº‹": "x",
            "á¶": "x",
            "Ã½":  "y",
            "Å·":  "y",
            "Ã¿":  "y",
            "áº": "y",
            "á»µ": "y",
            "á»³": "y",
            "Æ´":  "y",
            "á»·": "y",
            "á»¿": "y",
            "È³":  "y",
            "áº™": "y",
            "É":  "y",
            "á»¹": "y",
            "Åº":  "z",
            "Å¾":  "z",
            "áº‘": "z",
            "Ê‘":  "z",
            "â±¬": "z",
            "Å¼":  "z",
            "áº“": "z",
            "È¥":  "z",
            "áº•": "z",
            "áµ¶": "z",
            "á¶Ž": "z",
            "Ê":  "z",
            "Æ¶":  "z",
            "É€":  "z",
            "ï¬€": "ff",
            "ï¬ƒ": "ffi",
            "ï¬„": "ffl",
            "ï¬": "fi",
            "ï¬‚": "fl",
            "Ä³":  "ij",
            "Å“":  "oe",
            "ï¬†": "st",
            "â‚": "a",
            "â‚‘": "e",
            "áµ¢": "i",
            "â±¼": "j",
            "â‚’": "o",
            "áµ£": "r",
            "áµ¤": "u",
            "áµ¥": "v",
            "â‚“": "x"
        };

        return sText.replace(/[^A-Za-z0-9\[\] ]/g, function (sChar) {
            return oLatinizeMap[sChar] || sChar
        })
    };

    /**
     * Update given uri string parameters.
     * @param uri {string}
     * @param key {string}
     * @param value {string|number}
     * @return {string}
     * @url https://stackoverflow.com/questions/5999118/how-can-i-add-or-update-a-query-string-parameter
     */
    this.updateQueryStringParameter = function (uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            var hash = '';
            if (uri.indexOf('#') !== -1) {
                hash = uri.replace(/.*#/, '#');
                uri  = uri.replace(/#.*/, '');
            }
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";

            return uri + separator + key + "=" + value + hash;
        }
    };

    /**
     * Replace placeholders in a string.
     * The string should have "%varName%" in it, but the key has to be only "varName".
     * @param sText {string}
     * @param oReplace {Object}
     * @return {string}
     */
    this.replacePlaceholders = function (sText, oReplace) {
        this.forEach(oReplace, function (value, key) {
            sText = sText.replace('%' + key + '%', value);
        });

        return sText;
    };

    /**
     * Get a random string.
     * @param [length] {string}
     * @param [type] {string}
     * @return {string}
     */
    this.getRandomString = function (length, type) {
        length     = this.default(length, 8);
        type       = this.default(type, 'alnum');

        var pool   = '';
        if (type === 'alnum') {
            pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        } else if (type === 'alpha') {
            pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        } else if (type === 'hexdec') {
            pool = '0123456789abcdef';
        } else if (type === 'numeric') {
            pool = '0123456789';
        } else if (type === 'nozero') {
            pool = '123456789';
        } else if (type === 'distinct') {
            pool = '2345679ACDEFHJKLMNPRSTUVWXYZ';
        } else {
            throw new Error('Invalid pool type for Egf.Util.getRandomString()! Got: ' + type);
        }

        var result = "";
        for (var i = 0; i < length; i++) {
            result += pool.charAt(Math.floor(Math.random() * pool.length));
        }

        return result;
    };

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Array/Object                                               **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Clone object.
     * @param oVar {object|Array}
     * @return {object}
     */
    this.clone = function (oVar) {
        // If null object or not object.
        if (oVar === null || typeof oVar !== 'object') {
            return oVar;
        }

        // Clone date objects.
        if (oVar instanceof Date) {
            return new Date(oVar.getTime());
        }

        // Do the object cloning... with original constructor.
        var oTemp = oVar.constructor();
        for (var sKey in oVar) {
            if (oVar.hasOwnProperty(sKey)) {
                oTemp[sKey] = this.clone(oVar[sKey]);
            }
        }

        return oTemp;
    };

    /**
     * Like the original object.assign method, but works with older browsers.
     * @params It iterates all the given arguments and assign them into a new object.
     * @return {object} Union of argument objects.
     */
    this.objectAssign = function (/* ... */) {
        var oResult = {};
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'object') {
                for (var sKey in arguments[i]) {
                    if (arguments[i].hasOwnProperty(sKey)) {
                        oResult[sKey] = this.clone(arguments[i][sKey]);
                    }
                }
            }
        }

        return oResult;
    };

    /**
     * Iterate array or object.
     * @param xItems {Object|Array|NodeList|Object[]} Array or object to iterate.
     * @param fnWithItem Callback function on item. If has one argument, it's the value. If it has two arguments, the key is the first one and the value is the second.
     */
    this.forEach = function (xItems, fnWithItem) {
        if (typeof fnWithItem === 'function' && (fnWithItem.length === 1 || fnWithItem.length === 2)) {
            if (xItems instanceof Array) {
                for (var i = 0; i < xItems.length; i++) {
                    if (fnWithItem.length === 1) {
                        fnWithItem(xItems[i]);
                    }
                    else if (fnWithItem.length === 2) {
                        fnWithItem(i, xItems[i]);
                    }
                }
            }
            else if (xItems instanceof Object) {
                Object.keys(xItems).forEach(function (key) {
                    if (fnWithItem.length === 1) {
                        if (xItems.hasOwnProperty(key)) {
                            fnWithItem(xItems[key]);
                        }
                    }
                    else if (fnWithItem.length === 2) {
                        fnWithItem(key, xItems[key]);
                    }
                });
            }
            else {
                throw new TypeError("Invalid forEach parameter!");
            }
        }
        else {
            throw new TypeError("Egf.Util.forEach second parameter has to be a callback function with one or two parameters!");
        }
    };

    /**
     * Turn object into an array.
     * @param oVar {object}
     * @return {Array}
     */
    this.objectToArray = function (oVar) {
        var aVar = [];
        for (var sProperty in oVar) {
            if (oVar.hasOwnProperty(sProperty)) {
                aVar.push(oVar[sProperty]);
            }
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
     * Check if a key exists in an object.
     * @param oVar {object}
     * @param sKey {string}
     * @return {boolean}
     */
    this.keyExists = function (oVar, sKey) {
        return (typeof oVar[sKey] !== "undefined");
    };

    /**
     * Check if a value is in array or not.
     * @param aHaystack {Array}
     * @param xNeedle {number|string|object}
     * @param [bTypeCheck] {boolean}
     * @return {boolean}
     */
    this.isInArray = function (aHaystack, xNeedle, bTypeCheck) {
        bTypeCheck  = this.default(bTypeCheck, false);
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
     * @param xElement {number|string|object}
     * @return {boolean}
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
     * Get the first element of an array.
     * @param aInput {Array}
     * @param [xDefault] {number|string|object}
     */
    this.getArrayFirst = function (aInput, xDefault) {
        var xFirstElement = this.default(xDefault, null);

        if (aInput.length) {
            for (var i in aInput) {
                xFirstElement = aInput[i];
                break;
            }
        }

        return xFirstElement;
    };

    /**
     * Get the last element of an array.
     * @param aInput {Array}
     * @param [xDefault] {number|string|object}
     */
    this.getArrayLast = function (aInput, xDefault) {
        var xLastElement = this.default(xDefault, null);

        if (aInput.length) {
            for (var i in aInput) {
                xLastElement = aInput[i];
            }
        }

        return xLastElement;
    };

    /**
     * Sort objects of array.
     * @param aObjects {Array} Objects.
     * @param sProp {string} Property.
     * @param [bReverse] {boolean} Desc instead. Default null.
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

    /**
     * Get a random element from the array.
     * @param aInput {Array} Input array.
     * @return {string|number}
     */
    this.getRandomArrayElem = function (aInput) {
        return aInput[Math.floor(Math.random() * aInput.length)];
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Date                                                       **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Check if a variable is valid date. Work both strings and objects.
     * @param xDate {string|object|Date}
     * @return {boolean}
     */
    this.isValidDate = function (xDate) {
        if (typeof xDate === 'string') {
            return this.isValidDateString(xDate);
        }
        else if (typeof xDate === 'object') {
            return this.isValidDateObject(xDate);
        }
    };

    /**
     * Check if a variable is a valid date string.
     * @param sDate {string}
     * @return {boolean}
     */
    this.isValidDateString = function (sDate) {
        return this.isValidDateObject(new Date(sDate));
    };

    /**
     * Check if a variable is a valid date object.
     * @param oDate {Object|Date}
     * @return {boolean}
     */
    this.isValidDateObject = function (oDate) {
        return oDate && Object.prototype.toString.call(oDate) === "[object Date]" && !isNaN(oDate);
    };

};

/**
 * Working with dom.
 * @type {Egf.Elem}
 * @return {Egf.Elem}
 * @todo find parameters as array... find("#somediv") OR find([eBody, "#somediv"])
 */
Egf.Elem = new function () {

    /** @type {Egf.Elem} The service. */
    var ctrl = this;

    /**
     * Find element or elements in dom tree.
     * @param xElem {string|HTMLElement|HTMLCollection|NodeList} The elem identifier. Uses the usual querySelector format. If the elem itself is given, gives back that.
     * @return {HTMLElement|HTMLCollection|NodeList}
     * todo This sheet cannot pass element to search within that, because those sheep do not have getElementById method. Solution could be using the query selector, but then it would lose the "getElementById is faster" advantage. Frack this ship.
     */
    this.find = function (xElem) {
        // If the element or elements are given, give back that or those.
        if (xElem instanceof HTMLElement || xElem instanceof HTMLCollection || xElem instanceof NodeList) {
            return xElem;
        }
        // Find element by id... sometimes a function gives a # prefix, to force the search as an elemId, although it was there originally. In this case, it wont throw an error and it's not required to check there.
        if (Egf.Util.startsWith(xElem, '##') && xElem.indexOf(' ') === -1) {
            return document.getElementById(xElem.substr(2));
        }
        // Find element by id.
        else if (Egf.Util.startsWith(xElem, '#') && xElem.indexOf(' ') === -1) {
            return document.getElementById(xElem.substr(1));
        }
        // Find elements by className.
        else if (Egf.Util.startsWith(xElem, '.') && xElem.indexOf(' ') === -1) {
            return document.getElementsByClassName(xElem.substr(1));
        }
        // find elements by query selector.
        else {
            return document.querySelectorAll(xElem);
        }
    };

    /**
     * Add event to an element.
     * @param xElementArg {string|HTMLElement|HTMLCollection} Element query selector or HTMLElement or HTMLCollection.
     * @param sEvent {string} Event name. Click, mouseover, mouseout, etc.
     * @param fListener {function} Event listener function.
     * @param [bUseCapture] {boolean} Default false. If true, it uses capture event order (outer element event first) instead of bubbling (inner element event first).
     * @return {Egf.Elem}
     */
    this.addEvent = function (xElementArg, sEvent, fListener, bUseCapture) {
        var xElement = (typeof xElementArg === 'string' ? this.find(xElementArg) : xElementArg);
        bUseCapture  = Egf.Util.default(bUseCapture, false);

        // HTMLElement.
        if (xElement instanceof HTMLElement) {
            if (typeof fListener === 'function') {
                xElement.addEventListener(sEvent, fListener);
            }
            else {
                throw new Error('The Egf.Util.elementEvent() third parameter has to be function!');
            }
        }
        // HTMLCollections.
        else if (xElement instanceof HTMLCollection || xElement instanceof NodeList) {
            if (typeof fListener === 'function') {
                Egf.Util.forEach(xElement, function (eElement) {
                    if (eElement instanceof HTMLElement) {
                        if (typeof fListener === 'function') {
                            eElement.addEventListener(sEvent, fListener, bUseCapture);
                        }
                        else {
                            throw new Error('The Egf.Util.elementEvent() third parameter has to be function!');
                        }
                    }
                    else {
                        throw new Error("Invalid HTML element for Egf.Elem.addEvent! The " + i + " from the collection of HTMLElements.");
                    }
                });
            }
            else {
                throw new Error('The Egf.Util.elementsEvent() third parameter has to be function!');
            }
        }
        // Invalid.
        else {
            throw new Error('The Egf.Elem.addEvent() first parameter has to be an elem id or css class name or HTMLElement or HTMLCollection or NodeList! TypeOf xElementArg: ' + typeof xElementArg + ' xElement: ' + xElement + ' Event: ' + sEvent);
        }

        return this;
    };


    /**
     * Check if a HtmlElement has a cssClass or not.
     * @param xElementArg {string|HTMLElement}
     * @param sCssClassName {string}
     * @return {boolean}
     */
    this.hasCssClass = function (xElementArg, sCssClassName) {
        var eElement = (typeof xElementArg === 'string' ? this.find(xElementArg) : xElementArg);

        if (eElement instanceof HTMLElement) {
            if (eElement.classList) {
                return eElement.classList.contains(sCssClassName);
            }
            else {
                return eElement.getAttribute('class').indexOf(sCssClassName) > -1;
            }
        }
        else {
            throw new TypeError('Egf.Elem.hasCssClass first parameter has to be string (elemId) or HtmlElement!');
        }
    };

    /**
     * Add cssClass to HtmlElement.
     * @param xElementArg {string|HTMLElement}
     * @param sCssClassName {string}
     * @return {Egf.Elem}
     */
    this.addCssClass = function (xElementArg, sCssClassName) {
        var eElement = (typeof xElementArg === 'string' ? this.find(xElementArg) : xElementArg);

        if (eElement instanceof HTMLElement) {
            if (eElement.classList) {
                eElement.classList.add(sCssClassName);
            }
            else if (!this.hasCssClass(eElement, sCssClassName)) {
                eElement.setAttribute('class', eElement.getAttribute('class') + ' ' + sCssClassName);
            }
        }
        else {
            throw new TypeError('Egf.Elem.addCssClass first parameter has to be string (elemId) or HtmlElement!');
        }

        return ctrl;
    };

    /**
     * Remove cssClass from HtmlElement.
     * @param xElementArg {string|HTMLElement}
     * @param sCssClassName {string}
     * @return {Egf.Elem}
     */
    this.removeCssClass = function (xElementArg, sCssClassName) {
        var eElement = (typeof xElementArg === 'string' ? this.find(xElementArg) : xElementArg);

        if (eElement instanceof HTMLElement) {
            if (eElement.classList) {
                eElement.classList.remove(sCssClassName);
            }
            else if (this.hasCssClass(eElement, sCssClassName)) {
                eElement.setAttribute('class', eElement.getAttribute('class').replace(sCssClassName, ' '));
            }
        }
        else {
            throw new TypeError('Egf.Elem.removeCssClass first parameter has to be string (elemId) or HtmlElement!');
        }

        return ctrl;
    };


    /**
     * Add or remove a css class from or to an HtmlElement or to HtmlCollection elements.
     * @param xElementArg {string|HTMLElement|HTMLCollection} Element query selector or HTMLElement or HTMLCollection.
     * @param sClass {string} The css class.
     * @param bAddRemove {boolean} Add (true) or remove (false) the css class.
     * @return {Egf.Elem}
     */
    this.cssClass = function (xElementArg, sClass, bAddRemove) {
        var xElement = (typeof xElementArg === 'string' ? this.find(xElementArg) : xElementArg);

        // HTMLElement.
        if (xElement instanceof HTMLElement) {
            if (bAddRemove) {
                this.addCssClass(xElement, sClass);
            }
            else {
                this.removeCssClass(xElement, sClass);
            }
        }
        // HTMLCollection.
        else if (xElement instanceof HTMLCollection || xElement instanceof NodeList) {
            Egf.Util.forEach(xElement, function (eElement) {
                if (bAddRemove) {
                    ctrl.addCssClass(eElement, sClass);
                }
                else {
                    ctrl.removeCssClass(eElement, sClass);
                }
            });
        }
        // Invalid.
        else {
            throw new TypeError('Cannot ' + (bAddRemove ? 'add' : 'remove') + ' css class (' + sClass + ') ' + (bAddRemove ? 'to' : 'from') + ' invalid element ' + (typeof xElementArg === 'string' ? '(' + xElementArg + '):' : '') + '! Expects string or HtmlElement or HtmlCollection.');
        }

        return ctrl;
    };

    /**
     * Toggle the css class on a HtmlElement or on HtmlCollection elements.
     * @param xElementArg {string|HTMLElement|HTMLCollection} Element query selector or HTMLElement or HTMLCollection.
     * @param sClass {string} The css class.
     * @return {Egf.Elem}
     */
    this.cssClassToggle = function (xElementArg, sClass) {
        var xElement = (typeof xElementArg === 'string' ? this.find(xElementArg) : xElementArg);

        // HTMLElement.
        if (xElement instanceof HTMLElement) {
            // If the elem has the css class, then remove it.
            if (ctrl.hasCssClass(xElement, sClass)) {
                ctrl.cssClass(xElement, sClass, false);
            }
            // If the elem does not have the css class, then add it.
            else {
                ctrl.cssClass(xElement, sClass, true);
            }
        }
        // HTMLCollection.
        else if (xElement instanceof HTMLCollection || xElement instanceof NodeList) {
            Egf.Util.forEach(xElement, function (eElement) {
                // If the elem has the css class, then remove it.
                if (ctrl.hasCssClass(eElement, sClass)) {
                    ctrl.cssClass(eElement, sClass, false);
                }
                // If the elem does not have the css class, then add it.
                else {
                    ctrl.cssClass(eElement, sClass, true);
                }
            });
        }
        // Invalid.
        else {
            throw new Error('The Egf.Elem.cssClassToggle() first parameter has to be an element css class or HtmlElement or HtmlCollection!');
        }

        return ctrl;
    };

};

/**
 * A deprecated console service.
 *
 * Egf.Cl
 *      .enableDebug()
 *      .enableAdvancedDebug();
 * Egf.Cl.debug("Look at that...");
 *
 * todo Real errors in ajax callback functions are not in their real places... do something about that...
 * todo Rework the whole sheet...
 */
Egf.Cl = new function () {

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
     * Something in one of the Opera updates fucked this thing up... don't use it.
     */
    this.enableAdvancedDebug = function () {
        this.bShowDebug     = true;
        this.bAdvancedDebug = true;

        // Show the position of uncaught errors at the correct timeLine too.
        window.onerror = function (msg) {
            Egf.Cl.error('Some serious error happened there... see details somewhere around in the log.\nMessage: ' + msg);

            // Makes the original error message visible. True hides it.
            return false;
        };

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
        if (this.isFireFox() || this.isSafariOrIphone()) {
            console.error(s);
        } else {
            var sFileLine = this.getFileLine();

            if (this.bAdvancedDebug) {
                setTimeout(console.error.bind(console, '%c' + sFileLine, 'color: #666', s), 0);
            } else {
                console.error('%c' + sFileLine, 'color: #666', s);
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
        if (this.isFireFox() || this.isSafariOrIphone()) {
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
        if (this.isFireFox() || this.isSafariOrIphone()) {
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
     * @param s {string|number|object}
     * @return {Egf.Cl}
     */
    this.debug = function (s) {
        if (this.bShowDebug) {
            if (this.isFireFox() || this.isSafariOrIphone()) {
                console.log(s);
            } else {
                if (this.bAdvancedDebug) {
                    setTimeout(console.log.bind(console, '%c' + this.getFileLine(), 'color: #666', s), 0);
                } else {
                    console.log('%c' + this.getFileLine(), 'color: #666', s);
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
            if (this.isFireFox() || this.isSafariOrIphone()) {
                // Warn user about the FireFox problem, but only once.
                if (this.bAdvancedDebug) {
                    console.error('The cl.log() doesn\'t work in FireFox or in safari... sorry about that.');
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
        var that    = this;
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
        var sFunc       = sCallerLine.trim().split(' ')[1];
        var sParams     = '(' + aParams.join(', ') + ')';

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
        var sCallerLine  = this.getErrorObject().stack.split("\n")[4];
        var sClean       = sCallerLine.slice(sCallerLine.indexOf(this.sJsDir) + this.sJsDir.length + 1, sCallerLine.length);
        var sFileLineCol = sClean.substring(0, sClean.length - 1);
        var sFileLine    = sFileLineCol.slice(0, -(sFileLineCol.split(':')[2]).length - 1);

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
     * Clean the url of uncaught errors.
     * @param sUrl {string}
     * @return {string}
     */
    this.trimCustomErrorUrl = function (sUrl) {
        return sUrl.slice(sUrl.indexOf(this.sJsDir) + this.sJsDir.length + 1);
    };

    /**
     * Check if the browser is FireFox or not.
     * @return {boolean}
     */
    this.isFireFox = function () {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    };

    /**
     * Check if the browser is safari or the os is ios... if it's then it throws some unnecessary error...
     * @return {boolean} True if it would throw an unnecessary error.
     */
    this.isSafariOrIphone = function () {
        var ua        = navigator.userAgent.toLowerCase();
        var bIsSafari = false;
        try {
            bIsSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
                return p.toString() === "[object SafariRemoteNotification]";
            })(!window['safari'] || safari.pushNotification);
        }
        catch (err) {
        }
        bIsSafari = (bIsSafari || ((ua.indexOf('safari') != -1) && (!(ua.indexOf('chrome') != -1) && (ua.indexOf('version/') != -1))));

        var bIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        return (bIsSafari || bIos);
    };

};

/**
 * Ajax service.
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

        var sFullUrl = sUrl + (aQuery.length ? '?' + aQuery.join('&') : '');

        this.request(sFullUrl, 'GET', '', fSuccess, fError);
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
        this.request(sUrl, 'POST', JSON.stringify(oData), fSuccess, fError);
        // var aQuery = []; for (var sKey in oData) { if (oData.hasOwnProperty(sKey)) { aQuery.push(encodeURIComponent(sKey) + '=' + encodeURIComponent(oData[sKey])); } } this.request(sUrl, 'POST', aQuery.join('&'), fSuccess, fError);
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
        // oRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
        oRequest.onreadystatechange = function () {
            if (oRequest.readyState == 4) {
                // Success.
                if (oRequest.status == 200) {
                    if (typeof fSuccess === 'function') {
                        // Json.
                        if (oRequest.getResponseHeader('content-type') === 'application/json') {
                            fSuccess(JSON.parse(oRequest.response)); // responseText?
                        }
                        // String.
                        else {
                            fSuccess(oRequest.response); // responseText?
                        }
                    }
                }
                // Error.
                else {
                    Egf.Cl.error('Ajax ' + sMethod + ' request error! \n URL: ' + sUrl);
                    if (typeof fError === 'function') {
                        // Json.
                        if (oRequest.getResponseHeader('content-type') === 'application/json') {
                            fError(JSON.parse(oRequest.response)); // responseText?
                        }
                        // String.
                        else {
                            Egf.Cl.debug(oRequest);
                            fError(oRequest.response); // responseText?
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


/* todo The movement is... lumpy?
 this.scrollToItem = function (item) {
 var diff = (item.offsetTop - window.scrollY) / 20;
 if (!window._lastDiff) {
 window._lastDiff = 0;
 }

 if (Math.abs(diff) > 2) {
 window.scrollTo(0, (window.scrollY + diff))
 clearTimeout(window._TO)

 if (diff !== window._lastDiff) {
 window._lastDiff = diff;
 window._TO       = setTimeout(ctrl.scrollToItem, 150, item);
 }
 } else {
 window.scrollTo(0, item.offsetTop)
 }
 };
 */
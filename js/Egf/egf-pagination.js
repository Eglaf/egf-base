"use strict";

/**
 * Pagination.
 * @todo setToPageEvent
 */
Egf.Pagination = function Pagination() {

    /** @type {Egf.Pagination} That this. */
    var that = this;

    /** @type {string} The cssClass of container elements. */
    this.containerElementsCssClass = '';

    /** @type {string} Unique identifier of pagination block. */
    this.uniqueIdentifier = '';

    /** @type {object} Translations. */
    this.translations = {
        first:    'First',
        previous: 'Previous',
        next:     'Next',
        last:     'Last'
    };

    /** @type {object} */
    this.containerElements = [];

    /** @type {number} The current page. */
    this.currentPage = 1;

    /** @type {number} The max page. */
    this.maxPage = 1;

    /** @type {object} The event functions on clicking pagination buttons. */
    this.events = {
        toFirst:    function () {
        },
        toPrevious: function () {
        },
        toNext:     function () {
        },
        toLast:     function () {
        }
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Setters/Init                                               **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Set element referrers. Adds dot prefix if it's not there.
     * @param containerElementsCssClass {string}
     * @return {Egf.Pagination}
     */
    this.setContainerElementsCssClass = function (containerElementsCssClass) {
        this.containerElementsCssClass = (Egf.Util.startsWith(containerElementsCssClass, '.') ? containerElementsCssClass : '.' + containerElementsCssClass);

        return this;
    };

    /**
     * Set translations.
     * @param translations {object}
     * @return {Egf.Pagination}
     */
    this.setTranslations = function (translations) {
        this.translations = Egf.Util.objectAssign(this.translations, translations);

        return this;
    };


    /**
     * Initialize.
     * @return {Egf.Pagination}
     */
    this.init = function () {
        this.containerElements = Egf.Elem.find(this.containerElementsCssClass);
        this.uniqueIdentifier  = Egf.Util.getRandomString(8, 'alpha');

        return this;
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Refresh                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Refresh the content of pagination containers.
     * @return {Egf.Pagination}
     */
    this.refresh = function () {
        Egf.Util.forEach(this.containerElements, function (containerElement) {
            Egf.Template.toElementByTemplate(containerElement, 'js-template-egf-pagination', {
                uniqueIdentifier: that.uniqueIdentifier,
                currentPage:      that.currentPage,
                maxPage:          that.maxPage,
                text:             {
                    first:    that.translations.first,
                    previous: that.translations.previous,
                    next:     that.translations.next,
                    last:     that.translations.last
                }
            });
        });

        that.addEvents();

        return this;
    };


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Events                                                     **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Add events to buttons.
     * @return {Egf.Pagination}
     */
    this.addEvents = function () {
        console.log('pagination addEvents');

        // To first.
        Egf.Elem.addEvent('.' + this.uniqueIdentifier + '-egf-pagination-button-to-first', 'click', function (e) {
            e.preventDefault();
            that.events.toFirst();
        });

        // To previous.
        Egf.Elem.addEvent('.' + this.uniqueIdentifier + '-egf-pagination-button-to-previous', 'click', function (e) {
            e.preventDefault();
            that.events.toPrevious();
        });

        // To next.
        Egf.Elem.addEvent('.' + this.uniqueIdentifier + '-egf-pagination-button-to-next', 'click', function (e) {
            e.preventDefault();
            that.events.toNext();
        });

        // To last.
        Egf.Elem.addEvent('.' + this.uniqueIdentifier + '-egf-pagination-button-to-last', 'click', function (e) {
            e.preventDefault();
            that.events.toLast();
        });

        return this;
    };

    /**
     * Set the event of clicking first button.
     * @param fnToFirst {function}
     * @return {Egf.Pagination}
     */
    this.setToFirstEvent = function (fnToFirst) {
        that.events.toFirst = fnToFirst;

        return this;
    };

    /**
     * Set the event of clicking previous button.
     * @param fnToPrevious {function}
     * @return {Egf.Pagination}
     */
    this.setToPreviousEvent = function (fnToPrevious) {
        that.events.toPrevious = fnToPrevious;

        return this;
    };

    /**
     * Set the event of clicking next button.
     * @param fnToNext {function}
     * @return {Egf.Pagination}
     */
    this.setToNextEvent = function (fnToNext) {
        that.events.toNext = fnToNext;

        return this;
    };

    /**
     * Set the event of clicking last button.
     * @param fnToLast {function}
     * @return {Egf.Pagination}
     */
    this.setToLastEvent = function (fnToLast) {
        that.events.toLast = fnToLast;

        return this;
    }

};

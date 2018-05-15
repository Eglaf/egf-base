"use strict";

if (typeof Egf.Sf === 'undefined') {
    Egf.Sf = {};
}

/**
 * SF routes in JS.
 *
 * Usage in SF.
 * The parameter should be a natural number OR an "_id_" string.
 * Example route annotation.
 *   (at)Route("/admin/product/update/{product}", requirements={"product"="\d+|_id_"})
 *
 * Usage in JS...
 *   var url = new Egf.Sf.Route()
 *     .setRoute('{{ path('app_admin_product_update', {'product':'_id_'}) }}')
 *     .setParams({'_id_': row.id})
 *     .getUrl();
 */
Egf.Sf.Route = function () {

    /** @type {string} The SF route. */
    this.route = '';

    /** @type {Object} */
    this.params = {};

    /**
     * Set route.
     * @param route {string}
     * @return {Egf.Sf.Route}
     */
    this.setRoute = function (route) {
        this.route = route;

        return this;
    };

    /**
     * Set parameters.
     * @param params {object}
     * @return {Egf.Sf.Route}
     */
    this.setParams = function (params) {
        this.params = params;

        return this;
    };

    /**
     * Get final url.
     * @return {string}
     */
    this.getUrl = function () {
        var url = this.route;

        Egf.Util.forEach(this.params, function (from, to) {
            url = url.replace(from, to);
        });

        return url;
    }

};

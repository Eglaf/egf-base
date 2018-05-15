"use strict";

// Check requirements.
if (typeof Egf.Util === 'undefined') {
    console.error('The file egf.js is required!');
}

/**
 * Simple template system and an engine for it.
 * The engine is not secure because it uses eval.
 *
 * Template example:
 *  <script id="js-template-some-example" type="text/template">
 *      <div>
 *          <span><% this.var %></span>
 *          <% if ( this.var2 ) { %>
 *              <% this.var2 %>
 *          <% } %>
 *          <% for(var index in this.var3) { %>
 *              <% this.var3[index] %>
 *          <% } %>
 *      </div>
 *  </script>
 *
 * Usage:
 *  Egf.Template.toElement(elementInnerTemplate, 'js-template-some-example', {var1: 'qwer', var2:'asdf', var3:[1,2,3]});
 *
 * TODO Use another TemplateEngine... this one throws error when there is a lesser/greater than in condition!
 */
Egf.Template = new function () {

    /**
     * Check if a template exists or not.
     * @param sTemplateId {string} Template id.
     * @return {boolean} True if exists.
     */
    this.doesTemplateExist = function (sTemplateId) {
        return Egf.Util.boolVal(Egf.Elem.find('#' + sTemplateId));
    };

    /**
     * Get the final content of given html and data.
     * @param sHtml {string}
     * @param oData {object}
     */
    this.getHtmlContent = function (sHtml, oData) {
        return this.doTheMagic(sHtml, oData);
    };

    /**
     * Get the content of a template... with data.
     * @param sTemplateId {string}
     * @param oData {object}
     * @return {string}
     */
    this.getTemplateContent = function (sTemplateId, oData) {
        return this.doTheMagic(this.getTemplateRawContent(sTemplateId), oData);
    };

    /**
     * Get the raw html content of a template.
     * @param sTemplateId {string} Key of template file.
     * @return {string|null}
     */
    this.getTemplateRawContent = function (sTemplateId) {
        var eTemplate = Egf.Elem.find('#' + sTemplateId);
        if (eTemplate) {
            return eTemplate.innerHTML;
        }
        else {
            Egf.Cl.error('Template not found by id: ' + sTemplateId);
            return '';
        }
    };

    /**
     * It gives the html with data as content to the element
     * @param xElement {HTMLElement|string} The HTML element or the id of it.
     * @param sHtml {string} Html to extend with data.
     * @param oData {object} Data in template.
     */
    this.toElementByHtml = function (xElement, sHtml, oData) {
        var eElement = (typeof xElement === 'string' ? Egf.Elem.find('#' + xElement) : xElement);

        if (eElement instanceof HTMLElement) {
            eElement.innerHTML = this.getHtmlContent(sHtml, oData);
        }
        else {
            Egf.Cl.error('Egf.Template.htmlToElement() was called with an invalid Html element property.\nTypeof xElement: ' + typeof xElement + ' xElement: ' + xElement + ' typeof eElement: ' + typeof eElement + ' eElement: ' + eElement + ' html: ' + sHtml);
        }
    };

    /**
     * To the Html element, it gives a template as content with the data.
     * @param xElement {HTMLElement|string} The HTML element or the id of it.
     * @param sTemplateId {string} The key of template.
     * @param oData {object} Data in template.
     * @return {Egf.Template}
     */
    this.toElementByTemplate = function (xElement, sTemplateId, oData) {
        var eElement = (typeof xElement === 'string' ? Egf.Elem.find('#' + xElement) : xElement);

        if (eElement instanceof HTMLElement) {
            eElement.innerHTML = this.getTemplateContent(sTemplateId, oData);
        }
        else {
            Egf.Cl.error('Egf.Template.templateToElement() was called with an invalid Html element property.\nTemplateId: ' + sTemplateId + ' typeof xElement: ' + typeof xElement + ' xElement: ' + xElement + ' typeof eElement: ' + typeof eElement + ' eElement: ' + eElement);
        }

        return this;
    };

    /**
     * Do the js templating stuff.
     * @param html {string}
     * @param options {object}
     * @return {string}
     * @url http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
     */
    this.doTheMagic = function (html, options) {
        var re     = /<%([^%>]+)?%>/g;
        var reExp  = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
        var code   = 'var r=[];\n';
        var cursor = 0;
        var match;

        var add = function (line, js) {
            js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        };

        while (match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }

        add(html.substr(cursor, html.length - cursor));
        code += 'return r.join("");';

        return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
    };

};

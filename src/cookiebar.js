/**
 * Cookiebar module.
 *
 * @module cookiebar
 */

/* global module:true */

module = (typeof module === 'undefined') ? {} : module;
/** Create a poller */
module.exports = Cookiebar;

/**
 * Creates a Cookiebar instance.
 *
 * @constructor
 * @this {Cookiebar}
 * @param {object} options - the options
 * @param {HTMLElement|string} [options.el] - the DOM Element or an
 *     querySelector representing it
 * @public
 */
function Cookiebar(options) {
    /**
     * The default settings.
     * @var {object}
     * @inner
     */
    var defaults = {
        el: null
    };

    /**
     * The active settings.
     * @member {object} settings
     * @instance
     * @memberof module:cookiebar~Cookiebar
     */
    this.settings = Object.assign(defaults, options);

    /**
     * The bound HTMLElement.
     * @member {HTMLElement} el
     * @instance
     * @memberof module:cookiebar~Cookiebar
     */
    this.el = null;

    if (this.settings.el) {
        this.bindTo(this.settings.el);
    }
}

/**
 * Bind to an element container.
 *
 * Return <code>true</code> if the element was found and bound, returns
 * <code>false</code> in case of errors.
 *
 * @method
 * @param {HTMLElement|string} el - the DOM Element or an
 *     querySelector representing it
 * @param {Document|DocumentFragment} [document=window.document] - the Document
 *     or DocumentFragment to operate on.
 * @todo HTMLCollection
 * @returns {boolean}
 */
Cookiebar.prototype.bindTo = function (el, doc) {
    // default document
    if (typeof doc === 'undefined') {
        doc = window.document;
    }

    if (typeof el === 'string') {
        this.el = doc.querySelector(el);
    }
    if (el instanceof HTMLElement) {
        this.el = el;
    }

    if (this.el) {
        return true;
    } else {
        return false;
    }
};

/**
 * Set the (visibility) state of the cookiebar.
 *
 * <code>state</code> can be <code>undefined</code>/<code>null</code>,
 * <code>visible</code> or <code>hidden</code>.
 * When state is <code>undefined</code>/<code>null</code> the current state is
 * returned.
 *
 * Returns the current state.
 *
 * @method
 * @param {string} [state] - the state to set
 * @returns {string}
 */
Cookiebar.prototype.state = function (state) {
    if (typeof state === 'string') {
        if (!(this.el instanceof HTMLElement)) {
            throw new Error('Cookiebar: Not bound to an element.');
        }

        if (state === 'visible') {
            this.el.style.display = 'block';
        } else if (state === 'hidden') {
            this.el.style.display = 'none';
        }
    }

    return this._getState();
};

Cookiebar.prototype._getState = function () {
    if (this.el) {
        return this.el.style.display;
    } else {
        return null;
    }
};

// vim: set et ts=4 sw=4 :

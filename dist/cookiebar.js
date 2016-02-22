;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./cookiebar'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./cookiebar'));
  } else {
    root.Cookiebar = factory(root.Cookiebar);
  }
}(this, function(Cookiebar) {
/**
 * Object.assign() polyfill
 *
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @module polyfills/object/assign
 */

/**
 * Merges properties from sources into a target object.
 *
 * @static
 */
function assignPolyfill() {
    if (typeof Object.assign != 'function') {
        (function () {
            Object.assign = function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var output = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (var nextKey in source) {
                            if (source.hasOwnProperty(nextKey)) {
                                output[nextKey] = source[nextKey];
                            }
                        }
                    }
                }
                return output;
            };
        })();
    }
}

// vim: set et ts=4 sw=4 :

/**
 * The Cookiebar bundle.
 *
 * This includes the Cookiebar and adds needed polyfills.
 *
 * Currently IE9+, Edge, Chrome, Firefox and Safari are supported.
 *
 * @module cookiebar
 * @requires ./polyfills/object/assign
 */

/* global assignPolyfill */

/** Object.assign() polyfill */
assignPolyfill();

// vim: set et ts=4 sw=4 :

/**
 * Cookiebar module.
 *
 * @module cookiebar
 */

/* global module:true */

module = (typeof module === 'undefined') ? {} : module;
/** Create a poller */
module.exports = Cookiebar;

var root = this; // eslint-disable-line consistent-this

/**
 * Creates a Cookiebar instance.
 *
 * @constructor
 * @this {Cookiebar}
 * @param {object} options - the options
 * @param {HTMLElement|string} [options.el] - the DOM Element or an
 *     querySelector representing it
 * @param {string} [options.text='Default text'] - the default cookie text
 *     when filling an empty bar
 * @param {boolean} [options.setupCloseListener=true] - whether to setup
 *     an close listener (binds to elements with class <code>closeClass</code>
 * @param {string} [options.closeClass='close'] - the class used to identify
 *     the elements which the closeListener binds to
 * @param {string} [options.textSelecter=null] - the selecter used to find the
 *     wrapper for the warning text/markup
 * @param {function} [options.closeHandler=this._closeHandler] - the function
 *     which handles the close (see {@linkcode Cookiebar~_closeHandler} for the
 *     default implementation)
 * @param {string} [options.storage='local'] - the storage to use, for now
 *     this could be <code>local</code> for <code>window.localStorage</code> or
 *     <code>session</code> for <code>window.sessionStorage</code>
 * @param {string} [options.storageKey='mo-cookiebar.displayed'] - the key used
 *     in the storage to identify the state value
 * @param {boolean} [options.allowHiding=true] - whether to hide the cookiebar
 *     on page load when a browser visits a page for a second time
 * @public
 */
function Cookiebar(options) {
    /**
     * The default settings.
     * @var {object}
     * @inner
     */
    var defaults = {
        el: null,
        text: 'Default text',
        setupCloseListener: true,
        closeHandler: this._closeHandler,
        closeClass: 'close',
        textSelecter: null,
        storage: 'local',
        storageKey: 'mo-cookiebar.displayed',
        allowHiding: true
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

    /**
     * The close listener.
     *
     * Remembered to be able to remove it again.
     *
     * @member {function|EventListener} closeListener
     * @instance
     * @memberof module:cookiebar~Cookiebar
     */
    this.closeListener = null;

    /**
     * The state storage to use.
     *
     * Can be `localStorage` or `sessionStorage`
     *
     * @member {Storage} storage to use
     * @instance
     * @memberof module:cookiebar~Cookiebar
     */
    this.storage = null;

    if (this.settings.storage === 'local') {
        this.storage = root['localStorage'];
    }
    if (this.settings.storage === 'session') {
        this.storage = root['sessionStorage'];
    }

    if (this.settings.el) {
        this.bindTo(this.settings.el);
    }

    // set the visibility depending on displayed state
    if (this.el) {
        if (this.el.textContent === '') {
            this.text(this.settings.text);
        }

        if (this.displayed() && this.settings.allowHiding) {
            this.state('hidden');
        } else {
            this.state('visible');
        }
    }
}

/**
 * Bind to an element container.
 *
 * Only binds to the *first* found element yet. If you want to be specific
 * about an element, directly give the method a <code>HTMLElement</code>.
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
        doc = root['document'];
    }

    if (typeof doc['querySelector'] !== 'function') {
        throw new Error('Cookiebar: the binding context does not seem to be a Document or Element.');
    }

    // ensure that this.el is a HTMLElement or null
    if (typeof el === 'string') {
        var queried = doc.querySelector(el);
        if (queried instanceof HTMLElement) {
            this.el = doc.querySelector(el);
        }
    } else if (el instanceof HTMLElement) {
        this.el = el;
    }

    if (this.el && this.settings.setupCloseListener) {
        var self = this;
        this.closeListener = function (e) {
            self.settings.closeHandler.call(self, e);
            self.el.removeEventListener('click', self.closeListener, false);
        };
        this.el.addEventListener('click', this.closeListener, false);

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
 * @throws {Error} Will throw an error if not bound to an element.
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

/**
 * Get the (visibility) state of the container.
 *
 * Returns the current state.
 *
 * @private
 * @returns {string}
 */
Cookiebar.prototype._getState = function () {
    if (this.el) {
        return this.el.style.display;
    } else {
        return null;
    }
};

/**
 * Set cookiebar text.
 *
 * When text is <code>undefined</code>/<code>null</code> the current text is
 * returned.
 *
 * Returns the current text.
 *
 * @method
 * @param {string} [text] - the text to set
 * @throws {Error} Will throw an error if not bound to an element.
 * @returns {string}
 */
Cookiebar.prototype.text = function (text) {
    if (typeof text === 'string') {
        if (!(this.el instanceof HTMLElement)) {
            throw new Error('Cookiebar: Not bound to an element.');
        }

        var textEl = this._findTextEl();

        textEl.innerHTML = text;
    }

    return this._getText();
};

/**
 * Get the text of the container.
 *
 * Returns the current text.
 *
 * @private
 * @returns {string}
 */
Cookiebar.prototype._getText = function () {
    var textEl = this._findTextEl();

    if (textEl) {
        return textEl.textContent;
    } else {
        return '';
    }
};

/**
 * Get the HTML of the text of the container.
 *
 * Returns the current text HTML.
 *
 * @private
 * @returns {string}
 */
Cookiebar.prototype._getTextHTML = function () {
    var textEl = this._findTextEl();

    if (textEl) {
        return textEl.innerHTML;
    } else {
        return '';
    }
};

/**
 * Find the text element in the cookiebar markup.
 *
 * Returns the current text.
 *
 * @private
 * @returns {Element}
 */
Cookiebar.prototype._findTextEl = function () {
    var textEl = this.el;

    if (typeof this.settings.textSelector === 'string') {
        var el = this.el.querySelector(this.settings.textSelector);
        if (el) {
            textEl = el;
        }
    }
    return textEl;
};

/**
 * Handle closing of the cookiebar.
 *
 * @private
 */
Cookiebar.prototype._closeHandler = function (e) {
    e.preventDefault();

    var classesString = e.target.className || '';
    var classes = classesString.split(/\s+/);
    if (classes.indexOf(this.settings.closeClass) >= 0) {
        this.state('hidden');
        this.displayed('1');
    }
};

/**
 * Set cookiebar displayed state.
 *
 * <code>state</code> can be truthy or falsey
 * When state is not given, then the current state is returned.
 *
 * Returns whether the cookiebar was displayed or not.
 *
 * @method
 * @param {string} [state] - the state to set
 * @throws {Error} Will throw an error if not bound to an element.
 * @returns {boolean}
 */
Cookiebar.prototype.displayed = function (state) {
    if (typeof state === 'undefined') {
        return this._getDisplayed();
    }

    if (state == true) { // eslint-disable-line eqeqeq
        this.storage.setItem(this.settings.storageKey, '1');
    } else {
        this.storage.setItem(this.settings.storageKey, '0');
    }

    return this._getDisplayed();
};

/**
 * Get the displayed state.
 *
 * Returns whether the cookiebar was displayed or not.
 *
 * @private
 * @returns {boolean}
 */
Cookiebar.prototype._getDisplayed = function () {
    if (this.storage && this.storage['getItem']
        && this.storage.getItem(this.settings.storageKey) == true) { // eslint-disable-line eqeqeq
        return true;
    } else {
        return false;
    }
};

// vim: set et ts=4 sw=4 :

return module.exports;
}));

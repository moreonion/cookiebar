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
        if (this.el.textContent === '') {
            this.text(this.settings.text);
        }
    }

    // set the visibility depending on displayed state
    if (this.el) {
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

    if (typeof el === 'string') {
        this.el = doc.querySelector(el);
    }
    if (el instanceof HTMLElement) {
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

        this.el.innerHTML = text;
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
    if (this.el) {
        return this.el.textContent;
    } else {
        return '';
    }
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

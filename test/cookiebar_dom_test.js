/* global require describe it before after beforeEach */

var chai = require('chai');
var assert = chai.assert;
var Cookiebar = require('../src/cookiebar');

var jsdom = require('jsdom-global');

describe('Cookiebar', function () {
    before(function () {
        this.jsdom = jsdom();
    });

    after(function () {
        this.jsdom(); // cleanup
    });

    describe('binding of element', function () {
        beforeEach(function () {
            this.cookiebar = new Cookiebar();
            this.container = document.createElement('div');
            this.container.innerHTML = '<div id="container"></div>';
        });

        it('should return `true` if successful', function () {
            var returnValue = this.cookiebar.bindTo(this.container);
            assert.equal(true, returnValue);
        });

        it('should return `false` if failed', function () {
            var returnValue = this.cookiebar.bindTo('#non-existing', document);
            assert.equal(false, returnValue);
        });

        it('can bind to any given HTMLElement', function () {
            var el = document.createElement('div');
            var returnValue = this.cookiebar.bindTo(el);
            assert.equal(true, returnValue);
            assert.equal(el, this.cookiebar.el);
        });

        it('can bind to an HTML id', function () {
            var fragment = document.createDocumentFragment();
            fragment.appendChild(this.container);
            var returnValue = this.cookiebar.bindTo('#container', fragment);
            assert.equal('DIV', this.cookiebar.el.nodeName);
            assert.equal(true, returnValue);
        });

        it('can bind via an option of the constructor', function () {
            var el = document.createElement('div');
            var cookiebar = new Cookiebar({ el: el });
            assert.equal(el, cookiebar.el);
        });
    });

    describe('visibility state of Cookiebar', function () {
        beforeEach(function () {
            // reset jsdom's document every test because we do a lot of
            // appending here, so we want a clean slate every time
            this.jsdom(); // cleanup
            this.jsdom = jsdom();

            this.cookiebar = new Cookiebar();
            this.container = document.createElement('div');
            this.container.innerHTML = '<div id="container"></div>';
        });

        it('is `` when not in DOM', function () {
            this.cookiebar.bindTo(this.container);
            var state = this.cookiebar.state();
            assert.equal('', state);
        });

        it('is `block` when set `visible`', function () {
            document.body.appendChild(this.container);
            this.cookiebar.bindTo(this.container);
            this.cookiebar.state('visible');
            var state = this.cookiebar.state();
            assert.equal('block', state);
        });

        it('is `none` when set `hidden`', function () {
            document.body.appendChild(this.container);
            this.cookiebar.bindTo(this.container);
            this.cookiebar.state('hidden');
            var state = this.cookiebar.state();
            assert.equal('none', state);
        });

        it('throws an Error when not bound', function () {
            var self = this;
            assert.throws(function () {
                self.cookiebar.state('visible');
            }, Error, 'Cookiebar: Not bound to an element.');
        });

        it('can be initialized hidden with styling', function () {
            this.container.innerHTML = '<div id="container"></div>';
            this.container.setAttribute('style', 'display: none;');
            document.body.appendChild(this.container);
            this.cookiebar.bindTo(this.container);
            var state = this.cookiebar.state();
            assert.equal('none', state);
        });

        it('can be initialized visible with styling', function () {
            this.container.innerHTML = '<div id="container"></div>';
            this.container.setAttribute('style', 'display: block;');
            document.body.appendChild(this.container);
            this.cookiebar.bindTo(this.container);
            var state = this.cookiebar.state();
            assert.equal('block', state);
        });
    });
});

// vim: set et ts=4 sw=4 :

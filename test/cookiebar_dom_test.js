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

});

// vim: set et ts=4 sw=4 :

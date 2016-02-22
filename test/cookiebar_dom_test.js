/* global require describe it before after beforeEach */

var chai = require('chai');
var assert = chai.assert;
// test the dist/ because we need the UMD header for `window` to
// correctly resolve
var Cookiebar = require('../dist/cookiebar');

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
            this.container.setAttribute('id', 'container');
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

        it('does not throw errors when bound to non existing element', function () {
            var cookiebar = new Cookiebar();
            assert.doesNotThrow(function () {
                cookiebar.bindTo('#non-existing');
            });
        });

        it('does not throw errors when initialized with non existing element', function () {
            assert.doesNotThrow(function () {
                var cookiebar = new Cookiebar({
                    el: '#non-existing'
                });
                return cookiebar;
            });
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
            this.container.setAttribute('id', 'container');
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
            this.container.setAttribute('style', 'display: none;');
            document.body.appendChild(this.container);
            this.cookiebar.bindTo(this.container);
            var state = this.cookiebar.state();
            assert.equal('none', state);
        });

        it('can be initialized visible with styling', function () {
            this.container.setAttribute('style', 'display: block;');
            document.body.appendChild(this.container);
            this.cookiebar.bindTo(this.container);
            var state = this.cookiebar.state();
            assert.equal('block', state);
        });
    });

    describe('text content of Cookiebar', function () {
        beforeEach(function () {
            // reset jsdom's document every test because we do a lot of
            // appending here, so we want a clean slate every time
            this.jsdom(); // cleanup
            this.jsdom = jsdom();

            this.cookiebar = new Cookiebar();
            this.container = document.createElement('div');
            this.container.setAttribute('id', 'container');
        });

        it('throws an Error when not bound', function () {
            var self = this;
            assert.throws(function () {
                self.cookiebar.text('Dummy text');
            }, Error, 'Cookiebar: Not bound to an element.');
        });

        it('leaves any pre-defined text in the container', function () {
            assert.equal('', this.container.textContent);
            this.container.innerHTML = 'Pre-defined text.';
            this.cookiebar.bindTo(this.container);
            assert.equal('Pre-defined text.', this.container.textContent);
        });

        it('leaves any pre-defined text in the container', function () {
            var container = document.createElement('div');
            container.setAttribute('id', 'container');
            container.innerHTML = 'This is DEFAULT content!';
            assert.equal('This is DEFAULT content!', container.textContent);
            var cookiebar = new Cookiebar({
                el: container
            });
            cookiebar.bindTo(container);
            assert.equal('This is DEFAULT content!', container.textContent);
        });

        it('leaves any pre-defined markup in the container', function () {
            assert.equal('', this.container.textContent);
            this.container.innerHTML = '<i>Pre-defined</i> <span>Markup</span>';
            this.cookiebar.bindTo(this.container);
            assert.equal('Pre-defined Markup', this.container.textContent);
            assert.equal('<i>Pre-defined</i> <span>Markup</span>', this.container.innerHTML);
        });

        it('generates default text when container is empty', function () {
            document.body.appendChild(this.container);
            this.cookiebar.bindTo(this.container);
            assert.equal('', this.container.textContent);
            this.cookiebar.text('Default text');
            assert.equal('Default text', this.container.textContent);
            assert.equal('Default text', this.container.innerHTML);
        });

        it('generates customizable text when container is empty', function () {
            document.body.appendChild(this.container);
            assert.equal('', this.container.textContent);
            var cookiebar = new Cookiebar({
                el: this.container,
                text: 'Custom text for the cookiebar'
            });
            assert.equal('Custom text for the cookiebar', cookiebar.el.textContent);
        });

        it('generates customizable markup when container is empty', function () {
            document.body.appendChild(this.container);
            assert.equal('', this.container.textContent);
            var cookiebar = new Cookiebar({
                el: this.container,
                text: 'Custom <b>markup</b> for the cookiebar'
            });
            assert.equal('Custom markup for the cookiebar', cookiebar.el.textContent);
            assert.equal('Custom <b>markup</b> for the cookiebar', cookiebar.el.innerHTML);
        });
    });

    describe('preservation of markup in container', function () {
        it('uses the whole textContent if no `textSelector` is given', function () {
            var cookiebar = new Cookiebar();
            var container = document.createElement('div');
            container.setAttribute('id', 'container');
            cookiebar.bindTo(container);
            cookiebar.text('Custom <b>markup</b> for the cookiebar');
            assert.equal('Custom <b>markup</b> for the cookiebar', cookiebar.el.innerHTML);
            assert.equal('Custom markup for the cookiebar', cookiebar.text());
            assert.equal('Custom <b>markup</b> for the cookiebar', cookiebar._getTextHTML());
        });

        it('uses only the `textSelector` if given', function () {
            var cookiebar = new Cookiebar({
                textSelector: '.text'
            });
            var container = document.createElement('div');
            container.innerHTML = '<div class="outer"><span class="text"></span></div>';
            container.setAttribute('id', 'container');
            cookiebar.bindTo(container);
            cookiebar.text('Custom <b>markup</b> for the cookiebar');
            assert.equal('<div class="outer"><span class="text">Custom <b>markup</b> for the cookiebar</span></div>', cookiebar.el.innerHTML);
            assert.equal('Custom markup for the cookiebar', cookiebar.text());
            assert.equal('Custom <b>markup</b> for the cookiebar', cookiebar._getTextHTML());
        });
    });

    describe('closing of cookiebar via "click" events', function () {
        // TODO
    });
});

// vim: set et ts=4 sw=4 :

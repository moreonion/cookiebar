/* global require describe it */

var chai = require('chai');
var assert = chai.assert;
var Cookiebar = require('../dist/cookiebar');

describe('Cookiebar', function () {
    describe('constructor', function () {
        it('should be constructable with new', function () {
            var cookiebar = new Cookiebar();
            assert.ok(cookiebar instanceof Cookiebar);
        });
    });
});

// vim: set et ts=4 sw=4 :

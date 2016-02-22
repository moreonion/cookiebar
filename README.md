# Cookiebar.js

`Cookiebar` provides means to show and hide a cookie warning via JavaScript only.

It

* checks if a user already acknowledged a cookie before and does not show it a
  second time by default;
* stores it's information in the `localStorage` (default) or `sessionStorage`;
* respects any markup previously set in the container;
* uses the class `text` (default) to find it's place in the container;
* uses the class `close` (default) in the container to find it's closing
  triggers;
* allows to override the default closing handler.

The `Cookiebar` functions by setting the CSS `display` property of the
container to `block` (i.e. "visible") or to `none` (i.e. "hidden").

The styling is the responsibility of the page which uses the `Cookiebar`.
`cookiebar` does not provide any special means of controlling styling besides
settings the `display` propterty and CSS classes.

## Configuration

See http://moreonion.github.io/cookiebar/doc/module-cookiebar-Cookiebar.html
for the possible configuration options.

## Documentation

See https://moreonion.github.com/cookiebar/doc

## Browser Compatibility

Supported are modern browsers with ES5 support, i.e. IE9+, Firefox, Chrome,
Edge, Chrome Mobile, Android Browser, Safari.

## TODO

* generate a bar even if no container is present

## Changelog

* 0.0.3
* 0.0.2
* 0.0.1 "nothing special"

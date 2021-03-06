/* global require */

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var umd = require('gulp-umd');



/**
 * As vinyl in gulp is not up-to-date yet, we cannot utilized file.stem for now.
 * This is a helper function for that.
 *
 * @see http://stackoverflow.com/questions/3820381/need-a-basename-function-in-javascript
 */
function baseName(str) {
    var base = new String(str).substring(str.lastIndexOf('/') + 1);
    if (base.lastIndexOf('.') !== -1) {
        base = base.substring(0, base.lastIndexOf('.'));
    }
    return base;
}

/* ======================================================================= */
/*            DISTRIBUTE                                                   */
/* ======================================================================= */

gulp.task('dist', [ 'umd' ], function () {
    return gulp.src('dist/cookiebar.js')
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('browserify', function () {
    var b = browserify({
        entries: [ './dist/cookiebar.js' ]
    });
    return b.bundle()
        .pipe(source('cookiebar.js'))
        .pipe(rename('cookiebar-browserify.js'))
        .pipe(gulp.dest('dist'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('concat', function () {
    return gulp.src([ './src/polyfills/object/assign.js', './src/polyfills.js', './src/cookiebar.js' ])
        .pipe(concat('cookiebar.js'))
        .pipe(gulp.dest('build'));
});

/* ----------- cookiebar UMD --------------------------------------------- */

gulp.task('cookiebar', [ 'concat' ], function () {
    return gulp.src('build/cookiebar.js')
      .pipe(umd({
          exports: function () {
              return 'module.exports';
          },
          namespace: function () {
              return 'Cookiebar';
          },
          dependencies: function () {
              return [
                  {
                      name: 'Cookiebar',
                      amd: './cookiebar',
                      cjs: './cookiebar',
                      global: 'Cookiebar',
                      param: 'Cookiebar'
                  }
              ];
          }
      }))
      .pipe(rename('cookiebar.js'))
      .pipe(gulp.dest('dist/'));
});

/* ======================================================================= */
/*            COMPOUND TASKS                                               */
/* ======================================================================= */

gulp.task('umd', [
    'concat', 'cookiebar'
]);

gulp.task('default', [ 'umd', 'dist' ]);

// vim: set et ts=4 sw=4 :

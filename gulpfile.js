/* Example theme Gulp file. */
'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    pkg = require('./package.json');

var project_name = pkg.name;

/**
 * Task to rebuild CSS files.
 */
gulp.task('build-css', function() {
  return gulp.src('./app/assets/scss/**/*.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat(project_name + '.min.css'))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(plugins.sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(plugins.sourcemaps.write('./maps', {
      addComment: false,
      includeContent: false
    }))
    .pipe(gulp.dest('./assets/css'));
});

/**
 * Setup jshint, look at JS files which aren't minified.
 */
gulp.task('jshint', function() {
  return gulp.src(['./app/*.js', './app/**/*.js', '!./app/*.min.js', '!./app/**/*.min.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

/**
 * Build the JS files into one, minified named file with sourcemaps.
 */
gulp.task('build-js', function() {
  return gulp.src(['./app/*.js', './app/**/*.js', '!./app/*.min.js', '!./app/**/*.min.js'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat(project_name + '.min.js'))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('./maps', {
      addComment: false,
      includeContent: false
    }))
    .pipe(gulp.dest('./assets/js/'));
});

/**
 * Watch the files for changes, run code checks and compile SCSS.
 */
gulp.task('watch', function() {
  gulp.watch(['./app/assets/scss/*.scss', './app/assets/scss/**/*.scss'], ['build-css']);
  gulp.watch(['./app/*.js', './app/**/*.js'], ['jshint', 'build-js']);
});

/**
 * Set up a webserver for local development.
 */
gulp.task('webserver', function() {
  plugins.connect.server({
    port: 5678
  });
});

/**
 * Add the default task.
 */
gulp.task('default', ['watch', 'webserver']);

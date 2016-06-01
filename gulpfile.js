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
  return gulp.src('./src/assets/scss/**/*.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat(project_name + '.min.css'))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(plugins.sass({
      outputStyle: 'compressed'
    }).on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.write('./maps', {
      addComment: false,
      includeContent: false
    }))
    .pipe(gulp.dest('./src/assets/css'));
});

/**
 * Setup jshint, look at JS files which aren't minified.
 */
gulp.task('jshint', function() {
  return gulp.src(['./src/app/*.js', './src/app/**/*.js', './src/app/**/**/*.js', '!./src/app/*.min.js', '!./src/app/**/*.min.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

/**
 * Build the JS files into one, minified named file with sourcemaps.
 */
gulp.task('build-js', function() {
  return gulp.src(['./src/app/*.js', './src/app/**/*.js', './src/app/**/**/*.js', '!./src/app/*.min.js', '!./src/app/**/*.min.js'])
    .pipe(plugins.concat(project_name + '.min.js'))
    .pipe(plugins.uglify({mangle: false}))
    .pipe(gulp.dest('./src'));
});

/**
 * Build the vendor JavaScript.
 */
gulp.task('build-vendor-js', function() {
  return gulp.src([
      './bower_components/angular/angular.min.js',
      './bower_components/angular-ui-router/release/angular-ui-router.min.js',
      './bower_components/angulartics/dist/angulartics.min.js',
      './bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/cruk-pattern-library/assets/js/cruk-base.min.js',
      './bower_components/elastic.js/dist/elastic.min.js',
      './bower_components/elasticsearch/elasticsearch.angular.js',
      //'./bower_components/elasticui/dist/elasticui.min.js',
      './bower_components/angular-sanitize/angular-sanitize.min.js'
    ])
    .pipe(plugins.concat('vendor.min.js'))
    .pipe(gulp.dest('./src'));
});

/**
 * Build the vendor CSS.
 */
gulp.task('build-vendor-css', function() {
  return gulp.src([])
    .pipe(plugins.concat('vendor.min.css'))
    .pipe(gulp.dest('./src/assets/css'));
});

/**
 * Build the vendor files.
 */
gulp.task('build-vendor', ['build-vendor-js', 'build-vendor-css']);

/**
 * Watch the files for changes, run code checks and compile SCSS.
 */
gulp.task('watch', function() {
  gulp.watch(['./src/assets/scss/*.scss', './src/assets/scss/**/*.scss'], ['build-css']);
  gulp.watch(['./src/app/*.js', './src/app/**/*.js'], ['jshint', 'build-js']);
});

/**
 * Set up a webserver for local development.
 */
gulp.task('webserver', function() {
  plugins.connect.server({
    root: 'src',
    port: 5678
  });
});

/**
 * Add the default task.
 */
gulp.task('default', ['build-vendor', 'watch', 'webserver']);

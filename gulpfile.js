var gulp = require('gulp'),
  concat = require('gulp-concat'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-ruby-sass'),
  minifyHTML = require('gulp-minify-html'),
  uncss = require('gulp-uncss'),
  minifyCss = require('gulp-minify-css');

gulp.task('sass', function () {
  return sass('./public/css/')
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.scss', ['sass']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js hbs coffee',
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed(__dirname);
    }, 500);
  });
});

gulp.task('uncss', function() {
    return gulp.src('./public/css/style.css')
        // remove unused css classes
        .pipe(uncss({
            html: ['./views/**/*.html'],
            ignore: [/^meta.foundation/, /f-topbar-fixed/, /contain-to-grid/, /sticky/, /fixed/, /.*move-right/, /input/]
        }))
        // minify and concat resulted css
        .pipe(gulp.dest('./public/dst'));

});

gulp.task('css', function () {
    return gulp.src('./public/css/style.css')
        // remove unused css classes
        .pipe(uncss({
            html: ['./views/**/*.html'],
            ignore: [/^meta.foundation/, /f-topbar-fixed/, /contain-to-grid/, '.exit-menu', '#data-container',
            /fixed/, /menu-open/, /data-abide/, /input/, /close/, /top-bar-collapse/, /first-letter/]
        }))
        // minify and concat resulted css
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./public/dst'));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };

  return gulp.src('./views/**/*.hbs')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./views/dst'));
});

gulp.task('minify-css', function() {
    return gulp.src('./public/css/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./public/dst'));
});

gulp.task('js', function() {
  return gulp.src(['./public/components/fastclick/lib/fastclick.js',
    './public/components/foundation/js/foundation/foundation.js',
    './public/components/foundation/js/foundation/foundation.interchange.js',
    './public/components/foundation/js/foundation/foundation.abide.js',
    './public/components/foundation/js/foundation/foundation.slider.js',
    './public/js/dropzone.js',
    './public/js/app.js'])
    //.pipe(jshint())
    //.pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./public/dst'));
});

gulp.task('default', [
  'sass',
  'develop',
  'watch'
]);

gulp.task('production', [
  'css',
  'minify-html',
  'js'
]);

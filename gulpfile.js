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
    ext: 'js handlebars coffee',
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
            html: ['./views/index.html'],
            ignore: ['h2:first-letter', '.js .nav-collapse', '.nav-collapse.opened', '.nav-toggle', '.android .mask', '.mask', '.js-nav-active .mask', '.fixed', '.nav-toggle:before', '.nav-toggle.active:before', '.nav-collapse a:active', '.nav-collapse .active a', '.js .nav-collapse.closed', '.disable-pointer-events']
        }))
        // minify and concat resulted css
        .pipe(gulp.dest('./public/dst'));

});

gulp.task('css', function () {
    return gulp.src('./public/css/style.css')
        // remove unused css classes
        .pipe(uncss({
            html: ['./views/index.html'],
            ignore: ['h2:first-letter', '.js .nav-collapse', '.nav-collapse.opened', '.nav-toggle', '.android .mask', '.mask', '.js-nav-active .mask', '.fixed', '.nav-toggle:before', '.nav-toggle.active:before', '.nav-collapse a:active', '.nav-collapse .active a', '.js .nav-collapse.closed', '.disable-pointer-events']
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
 
  return gulp.src('./views/**/*.handlebars')
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
  return gulp.src(['./public/js/responsive-nav.js', './public/js/scroll.js', './public/js/fixed-responsive-nav.js', './public/js/ux.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
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

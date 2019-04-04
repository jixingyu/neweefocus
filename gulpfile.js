'use strict';

const gulp = require('gulp');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const cleanCSS 	= require('gulp-clean-css');
const babel = require('gulp-babel');
const { series, parallel } = gulp;
const assertBaseDir = 'app/public';
const distBaseDir = assertBaseDir + '/build';


gulp.task('clean', function() {
  console.log('Task clean!');
});

gulp.task('style', function() {
  console.log('Task style!');
  return gulp.src(assertBaseDir + '/css/*.*')
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(gulp.dest(distBaseDir + '/css/'));

});

gulp.task('js', function() {
  console.log('Task js!');
  return gulp.src(assertBaseDir + '/js/*.js')
    .pipe(babel({ presets: [ '@babel/env' ] }))
    .pipe(uglify({ mangle: true }))
    .pipe(gulp.dest(distBaseDir + '/js'));
});

gulp.task('watch', function() {
  gulp.watch(assertBaseDir + '/js/*.js', gulp.series([ 'js' ]));
  gulp.watch(assertBaseDir + '/css/*.css', gulp.series([ 'style' ]));
});


exports.default = parallel('style', 'js');
exports.dev = series(parallel('style', 'js'), 'watch');

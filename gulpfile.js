var gulp = require('gulp');
var eslint = require('gulp-eslint');    //linter
var concat = require('gulp-concat');    //concats files
var uglify = require('gulp-uglify');    //minify
var imagemin = require('gulp-imagemin');//for images
var rimraf = require('rimraf');         //file and folder removal
                                        //see, gulp-clean
var mocha = require('gulp-mocha');


var protractor = require("gulp-protractor").protractor;
var webdriver_standalone = require("gulp-protractor").webdriver_standalone;
gulp.task('webdriver_standalone', webdriver_standalone);

gulp.src(["./src/tests/*.js"])
    .pipe(protractor({
        configFile: "test/protractor.config.js",
        args: ['--baseUrl', 'http://127.0.0.1:8000']
    })) 
    .on('error', function(e) { throw e })

var bases = {
 client: 'client/',
 distTest: 'distTest/',
 server: 'server/',
 test: 'test/'
};

gulp.task('test', function () {
    return gulp.src(bases.test +'**/*', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});


gulp.task('watch', function() {
 gulp.watch('client/**/*', ['scripts', 'copy']);
});

gulp.task('lint', function(){
  console.log(bases.server+'**/*');
  return gulp.src(["client/**/*.js"])
  .pipe(eslint())
  .pipe(eslint.failOnError());
});

gulp.task('default', ['lint'], function() {
  console.log('linting complete');
});

gulp.task('copy', function(){
  var paths = {
   scripts: ['server/*.js'],
   html: ['client/index.html'],
   dist: 'test/'
  };

  gulp.src(paths.scripts.concat(paths.html))
  .pipe(gulp.dest(paths.dist));
});

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var sprockets = require('gulp-sprockets').default;
var del = require('del');
var runSequence = require('run-sequence');

var $ = gulpLoadPlugins({ lazy: false });
var assetsPaths = {
  app: "./app/assets/v2",
  javascripts: [],
  stylesheets: [],
  images: []
};
var destPath = "./public/assets"
var release = process.env.NODE_ENV === 'release'

// console.log(sprockets);
// initialize sprockets!
sprockets.declare(assetsPaths, destPath);


/**
 * Sprockets way
 */

gulp.task('build:image', () => {
  return gulp.src([assetsPaths.app + '/images/**/*.png', assetsPaths.app + '/images/**/*.jpg'])
    .pipe($.if(release, sprockets.precompile()))
    .pipe(gulp.dest(destPath))
});

// gulp.task('build:css', () => {
//   return gulp.src([assetsPaths.app + '/stylesheets/*.{css|scss}'])
//     .pipe($.cached('css'))
//     .pipe(sprockets.css({precompile: release}))
//     .pipe($.if(release, sprockets.precompile()))
//     .pipe(gulp.dest(destPath))
// });

gulp.task('build:js', () => {
  console.log('buidling js...');
  console.log(destPath);
  return gulp.src([assetsPaths.app + '/javascripts/*.js'])
    .pipe($.babel())
    .pipe(sprockets.js())
    .pipe($.if(release, sprockets.precompile()))
    .pipe(gulp.dest(destPath))
});


/**
 * ES6
 */

// gulp.task('build:es6', () => {
//   return gulp.src([assetsPaths.app + '/javascripts/**/*.{js|jsx}'])
//     .pipe($.babel())
//     .pipe($.if(release, sprockets.precompile()))
//     .pipe(gulp.dest(destPath))
// });


/**
 * SCSS
 */

// gulp.task('build:scss', () => {
//   return gulp.src([assetsPaths.app + '/stylesheets/**/*.scss'])
//     .pipe($.cached('scss'))
//     .pipe(sprockets.scss({precompile: release}))
//     .pipe($.if(release, sprockets.precompile()))
//     .pipe(gulp.dest(destPath))
// });


gulp.task('clean', (cb) => {
  return del(destPath, cb);
});

gulp.task('default', () => {
  runSequence(
      'clean',
      'build:image',
      // ['build:css', 'build:js', 'build:scss', 'build:es6']);
      ['build:js']);//, 'build:es6']);
});

gulp.task('watch', ['default'], () => {
  gulp.watch([assetsPaths.app + '/javascripts/**/*.coffee'], ['build:js'])
    .on('change', (e) => {
      console.log(`File ${e.path} was ${e.type}, running build task...`);
    });
  gulp.watch([assetsPaths.app + '/stylesheets/**/*.(css|scss|sass)'], ['build:css'])
    .on('change', (e) => {
      console.log(`File ${e.path} was ${e.type}, running build task...`);
    });
});

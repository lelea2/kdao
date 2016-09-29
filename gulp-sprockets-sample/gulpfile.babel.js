import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import sprockets from 'gulp-sprockets';
import del from 'del';
import runSequence from 'run-sequence';

import debug from 'gulp-debug';
import uglify from 'gulp-uglify';
const using = require('gulp-using');
const $ = gulpLoadPlugins({ lazy: false });

const assetsPaths = {
  app: "./app/assets",
  javascripts: [],
  stylesheets: [],
  images: []
};
const destPath = "./public/assets"
const release = process.env.NODE_ENV === 'release'

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

gulp.task('build:css', () => {
  return gulp.src([assetsPaths.app + '/stylesheets/*.css'])
    .pipe($.cached('css'))
    .pipe(sprockets.css({precompile: release}))
    .pipe($.if(release, sprockets.precompile()))
    .pipe(gulp.dest(destPath))
});


/**
 * ES6
 */
var transformDest = './app/assets/javascripts/react_components_transform';
console.log(">>>>>>> transformDest: " + transformDest);
gulp.task('build:es6', () => {
  console.log('>>>>>>>>>>>>>>> transform jsx');
  return gulp.src([assetsPaths.app + '/javascripts/react_components/views/**/*.jsx'])
    .pipe(debug({}))
    .pipe(using({}))
    .pipe($.babel({
      presets: ['es2015', 'react']
    }))
    .pipe(uglify({}))
    .pipe($.if(release, sprockets.precompile()))
    .pipe(gulp.dest(transformDest))
});

console.log(sprockets.js());

gulp.task('build:js', () => {
  console.log('>>>>>>>>>> build js <<<<<<<<<<<<<<<')
  return gulp.src([assetsPaths.app + '/javascripts/*.js'])
    .pipe(using({}))
    .pipe(sprockets.js())
    .pipe(uglify({}))
    .pipe($.if(release, sprockets.precompile()))
    .pipe(gulp.dest(destPath))
});


/**
 * SCSS
 */

gulp.task('build:scss', () => {
  return gulp.src([assetsPaths.app + '/stylesheets/roots/*.scss'])
    .pipe($.cached('scss'))
    .pipe(sprockets.scss({precompile: release}))
    .pipe($.if(release, sprockets.precompile()))
    .pipe(gulp.dest(destPath))
});


/**
 * Provided tasks
 */

gulp.task('clean', (cb) => {
  return del(destPath, cb);
});

gulp.task('default', () => {
  runSequence(
      'clean',
      'build:image',
      'build:es6',
      ['build:css', 'build:js', 'build:scss']);
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

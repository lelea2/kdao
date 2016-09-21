'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var autoprefixer = require('gulp-autoprefixer');
var babel        = require('gulp-babel');
var browserSync  = require('browser-sync');
var concat       = require('gulp-concat');
var eslint       = require('gulp-eslint');
var newer        = require('gulp-newer');
var sourcemaps   = require('gulp-sourcemaps');
var runSequence = require('run-sequence'); //Some tasks need to run in sequence, this is to make sure task required run in sequence


// gulp.task('hello', function() {
//     console.log('Hello Zell');
// });

// gulp.task('sass', function(){
//     return gulp.src('source-files')
//         .pipe(sass()) // Using gulp-sass
//             .pipe(gulp.dest('destination'))
// });

//Output errors on gulp build
//Reference from: https://jonsuh.com/blog/integrating-react-with-gulp/
var onError = function(err) {
  notify.onError({
    title:    "Error",
    message:  "<%= error %>",
  })(err);
  this.emit('end');
};

var plumberOptions = {
  errorHandler: onError,
};

var jsFiles = {
  vendor: [
  ],
  source: [
  ]
};

//Start browser sync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  })
})

/****************************************************************************************/
/**********************************  Working with JS ************************************/
/****************************************************************************************/

gulp.task('copy-react', function() {
  return gulp.src('node_modules/react/dist/react.js')
    .pipe(newer('dist/js/vendor/react.js'))
    .pipe(gulp.dest('dist/js/vendor'));
});
gulp.task('copy-react-dom', function() {
  return gulp.src('node_modules/react-dom/dist/react-dom.js')
    .pipe(newer('dist/js/vendor/react-dom.js'))
    .pipe(gulp.dest('dist/js/vendor'));
});
gulp.task('copy-jquery', function() {
  return gulp.src('node_modules/jquery/dist/jquery.js')
    .pipe(newer('dist/js/vendor/jquery.js'))
    .pipe(gulp.dest('dist/js/vendor'));
});

gulp.task('copy_vendor', ['copy-react', 'copy-react-dom', 'copy-jquery'], function() {
});

var vendorJSFiles = [
  'dist/js/vendor/jquery.js',
  'dist/js/vendor/react.js',
  'dist/js/vendor/react-dom.js',
  'app/js/src/utility',
  'app/js/src/shared_components/rs_input.js.jsx'
];

gulp.task('copy-js-vendor', function() {
  return gulp
    .src(vendorJSFiles)
    .pipe(gulp.dest('assets/js'));
});

// Concatenate jsFiles.vendor and jsFiles.source into one JS file.
// Run copy-react and common to dist folder
gulp.task('concat_vendor', function() {
  return gulp.src(vendorJSFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('common.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
});

//Concat vendor (run after copy-js-vendor)
gulp.task('concat_external', function() {
  runSequence(
    'copy_vendor',
    'copy-js-vendor',
    'concat_vendor'
  );
});


/****************************************************************************************/

/****************************************************************************************/
/**********************************  Working with CSS ***********************************/
/****************************************************************************************/

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

/****************************************************************************************/


/****************************************************************************************/
/**********************************  Working files changed ******************************/
/****************************************************************************************/
gulp.task('watch', function() {
  //gulp.watch('assets/js/src/*.{js,jsx}', ['concat']);
  gulp.watch('assets/sass/**/*.scss', ['sass']);
});

/****************************************************************************************/


gulp.task('build', ['sass', 'concat_external']);// 'concat']);
gulp.task('default', ['build', 'browserSync', 'watch']);


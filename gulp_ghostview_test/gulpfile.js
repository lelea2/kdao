'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');


// gulp.task('hello', function() {
//     console.log('Hello Zell');
// });

// gulp.task('sass', function(){
//     return gulp.src('source-files')
//         .pipe(sass()) // Using gulp-sass
//             .pipe(gulp.dest('destination'))
// });

//Output errors on gulp build
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


gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

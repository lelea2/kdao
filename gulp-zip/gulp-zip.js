import del     from 'del';
import gulp    from 'gulp';
import zip     from 'gulp-zip';
import install from 'gulp-install';
import yargs   from 'yargs';

import {
  build as config
} from '../package.json';

// Override 'clean' task to include payload dir
gulp.task('clean', () => {
  return del([config.paths.dist, config.paths.coverage, config.paths.payload], { force: true} );
});

// Install production-mode deps in 'dist'
gulp.task('deps', () => {
  return gulp.src('package.json')
    .pipe(gulp.dest(config.paths.dist))
    .pipe(install({production: true}));
});

// Install support binaries in 'dist'
gulp.task('bin', () => {
  return gulp.src(`${config.paths.bin}/**/*`)
    .pipe(gulp.dest(config.paths.dist));
});

// Prepare zip of compiled source and dependencies
gulp.task('zip', () => {
  return gulp.src([`${config.paths.dist}/**/*`, `!${config.paths.dist}/package.json`])
    .pipe(zip('package.zip'))
    .pipe(gulp.dest(config.paths.payload));
});

gulp.task('package', gulp.series('build', 'bin', 'deps', 'zip'));

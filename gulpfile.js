var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('styles', function () {
  gulp.src('stylesheets/**/*.scss')
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(gulp.dest('./assets/stylesheets/'));
});


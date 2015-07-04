var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('default', function() {
  return gulp.src('../stylesheets/*.scss')
    // .pipe(watch('../stylesheets/*.scss'))
    .pipe(sass())
    .pipe(gulp.dest('dist'));
});

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-ruby-sass');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  return sass('stylesheets/**/*.scss', { sourcemap: true })
    .on('error', function (err) {
      console.error('Error!', err.message);
    })

    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))

    .pipe(sourcemaps.write('maps', {
        includeContent: false,
        sourceRoot: 'stylesheets/**/*.scss'
    }))

    .pipe(gulp.dest('./assets/'));
});

//Watch
gulp.task('watch', function () {
  gulp.watch('stylesheets/**/*.scss', ['sass']);
});

//Default
// gulp.task('default', function () {
  
// });


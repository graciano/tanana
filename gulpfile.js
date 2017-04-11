'use strict'

var gulp = require('gulp')
var sass = require('gulp-sass')

gulp.task('sass', function () {
  return gulp.src('./app/sass/**/style.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'))
})

gulp.task('watch', function () {
  gulp.watch('./app/sass/**/*.scss', ['sass'])
})

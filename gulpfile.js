var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  sass = require('gulp-sass'),
  urlAdjuster = require('gulp-css-url-adjuster');

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'src'
    },
    port: 8080,
    notify: false
  });
});

gulp.task('sass', function(){
  return gulp.src('src/scss/style.scss')
    .pipe(sass())
    .pipe(urlAdjuster({
      prepend: '/img/',
    }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('watch', function () {
  gulp.watch('src/scss/*.scss', gulp.parallel('sass'));
  gulp.watch('src/*.html').on('change', function () {
    browserSync.reload();
  });
});

gulp.task('prebuild', async function() {
  gulp.src('src/img/**/*')
  .pipe(gulp.dest('app/img'));

  gulp.src('src/scss/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
  
  gulp.src('src/js/index.js')
	.pipe(gulp.dest('app/js'));

  gulp.src('src/server/server.js')
  .pipe(gulp.dest('app/server'));

  gulp.src('src/*.html')
  .pipe(gulp.dest('app'));
});

gulp.task('default', gulp.parallel(['browserSync', 'watch']));
gulp.task('build', gulp.parallel('prebuild'));

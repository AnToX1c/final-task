var gulp = require('gulp'),
  browserSync = require('browser-sync');

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'src'
    },
    port: 8080,
    notify: false
  });
});

gulp.task('watch', function () {
  // gulp.watch('src/*.html', ['reload']);
  // gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/*.html').on('change', function () {
    browserSync.reload();
  });
  // gulp.watch('src/*.css', browserSync.reload);
  // gulp.watch('src/*.js', browserSync.reload);
});

gulp.task('default', gulp.parallel(['browserSync', 'watch']));

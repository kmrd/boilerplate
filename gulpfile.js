// Include gulp
var gulp      = require('gulp');

// Include Our Plugins
var jshint        = require('gulp-jshint');
var sass          = require('gulp-sass');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var rename        = require('gulp-rename');
var autoprefixer  = require('gulp-autoprefixer');
var file          = require('gulp-file');
var log           = require('fancy-log');

gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sass', gulp.series(
  function cssVendor() {
    return gulp.src('src/css/vendor/*.css')
      .pipe(gulp.dest('build/css/vendor'));
    },
  function scssParse() {
    return gulp.src('src/css/*.scss')
      .pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(gulp.dest('build/css'));
    }
  )
);

gulp.task('scripts', gulp.series(
  function JSVendor() {
    return gulp.src('src/js/vendor/*.js')
      .pipe(gulp.dest('build/js/vendor'));
  },
  function JSParse() {
    return gulp.src('src/js/*.js')
      .pipe(concat('all.js'))
      .pipe(gulp.dest('build/js'))
      .pipe(rename('all.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('build/js'));
    }
  )
);

gulp.task('html', function(done) {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'));
});


gulp.task('rootassets', function() {
  return gulp.src(['src/*','!src/*.html','!src/touch'])
    .pipe(gulp.dest('build'));
});

gulp.task('imgs', function() {
  return gulp.src('src/imgs/*')
    .pipe(gulp.dest('build/imgs'));
});

gulp.task('touch', function touch() {
  return file('touch', String(new Date().getTime()), { src: true })
    .pipe( gulp.dest('build'));
});




// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('src/js/*.js', gulp.series('lint', 'scripts', 'touch'));
  gulp.watch('src/css/*.scss', gulp.series('sass','touch'));
  gulp.watch('src/imgs/*', gulp.series('imgs','touch'));
  gulp.watch(['src/*','!src/*.html'], gulp.series('rootassets', 'touch'));
  gulp.watch(['src/*.html','src/_templates/*'], gulp.series('html','touch'));
});

// Default Task
gulp.task('default',
  gulp.series(
    'lint',
    'sass',
    'scripts',
    'imgs',
    'rootassets',
    'html',
    'touch',
    'watch')
  );


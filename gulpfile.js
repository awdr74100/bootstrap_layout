const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');
const parseArgs = require('minimist');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const gulpPlumber = require('gulp-plumber');

// 獲取命令行參數 ( --env xxx )
const argv = parseArgs(process.argv.slice(2)).env;

// 處理 HTML
const htmlTask = () => {
  return gulp
    .src('./src/*.html')
    .pipe(gulpPlumber())
    .pipe(gulpif(argv === 'production', htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
};

// 處理 SCSS
const scssTask = () => {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(gulpPlumber())
    .pipe(
      sass({
        includePaths: ['./node_modules/bootstrap/scss'],
      }).on('error', sass.logError)
    )
    .pipe(postcss())
    .pipe(gulpif(argv === 'production', cleanCSS({ compatibility: 'ie8' })))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
};

// 處理 vendor
const vendorJS = () => {
  return gulp
    .src([
      './node_modules/jquery/dist/jquery.slim.min.js',
      './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
      './src/js/*.js',
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/js'));
};

// 處理圖片
const imageTask = () => {
  return gulp
    .src('./src/img/*')
    .pipe(gulpif(argv === 'production', imagemin()))
    .pipe(gulp.dest('./dist/img'))
    .pipe(browserSync.stream());
};

// 刪除緩存檔案
const clear = () => {
  return del(['dist']);
};

// 本地伺服器
const watchTask = () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
  gulp.watch('./src/*.html', htmlTask);
  gulp.watch('./src/**/*.scss', scssTask);
  gulp.watch('./src/**/*.js', vendorJS);
};

module.exports = {
  build: gulp.series(clear, gulp.parallel(htmlTask, scssTask, imageTask, vendorJS)),
  serve: gulp.series(clear, gulp.parallel(htmlTask, scssTask, imageTask, vendorJS), watchTask),
};

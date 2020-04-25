var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var bs = require('browser-sync').create();
var sass = require('gulp-sass');
var path = {
    'html': './template/**/',
    'css':'./src/css/',
    'js':'./src/js/',
    'image':'./src/image/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'image_dist': './dist/image/',
};
//定义压缩图片的任务
gulp.task('images',function () {
    gulp.src(path.image + '*.*')
        .pipe(rename({
            'suffix':'.min'
        }))
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.image_dist))
        .pipe(bs.stream())
});
//定义加载html的任务
gulp.task('html', function () {
   gulp.src(path.html + '*.html')
       .pipe(bs.stream())
});
//定义压缩css文件的任务
gulp.task('css', function () {
   gulp.src(path.css + '*.scss')
       .pipe(sass().on('error', sass.logError))
       .pipe(cssnano())
       .pipe(rename({
           'suffix':'.min'
       }))
       .pipe(gulp.dest(path.css_dist))
       .pipe(bs.stream())
});
//定义压缩js文件的任务
gulp.task('js',function () {
    gulp.src(path.js + '*.js')
        .pipe(uglify())
        .pipe(rename({
            'suffix':'.min'
        }))
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())
});


//定义监听css文件修改的任务
gulp.task('watch',function () {
    gulp.watch(path.css + '*.scss', ['css']);
    gulp.watch(path.js + '*.js', ['js']);
    gulp.watch(path.image + '*.*', ['images']);
    gulp.watch(path.html + '*.html', ['html']);
});
//定义浏览器初始化的任务
gulp.task('bs', function () {
    bs.init({
        'server': {
            baseDir:'./'
        }
    })
});
//定义浏览器刷新任务
gulp.task('server',['bs', 'watch']);
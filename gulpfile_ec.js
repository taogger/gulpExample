var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat')
    //- 对文件名加MD5后缀
    rev = require('gulp-rev');
    //- 路径替换
    revCollector = require('gulp-rev-collector');
    var browserSync = require('browser-sync').create();

    gulp.task('sass', function() {
        return sass('/Volumes/c/www/ecstore2.3.77/themes/TSINOVA/images/*.scss', {style: "expanded"})
            //.pipe(sass({style: "expanded"}))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            // .pipe(rename({suffix: '.min'}))
            // .pipe(cleancss())
            .pipe(gulp.dest('/Volumes/c/www/ecstore2.3.77/themes/TSINOVA/images'))
            .pipe(notify({ message: 'Styles task complete' }))
            .pipe(browserSync.stream());
    });
    
    gulp.task('js', function () {
        return gulp.src('js/*js')
            .pipe(browserify())
            .pipe(uglify())
            .pipe(gulp.dest('dist/js'))
            .pipe(browserSync.stream());;
    });
    gulp.task('scripts', function() {
      return gulp.src('dist/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js/'));
    });
    gulp.task('concat', function() {                                //- 创建一个名为 concat 的 task
        gulp.src('/Volumes/c/www/ecstore2.3.77/themes/TSINOVA/images/*.css')    //- 需要处理的css文件，放到一个字符串数组里
            .pipe(concat('all.min.css'))                            //- 合并后的文件名
            .pipe(cleancss())                                      //- 压缩处理成一行
            .pipe(rev())                                            //- 文件名加MD5后缀
            .pipe(gulp.dest('/Volumes/c/www/ecstore2.3.77/themes/TSINOVA/images'))                               //- 输出文件本地
            .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
            .pipe(gulp.dest('rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内
    });

    gulp.task('rev', function() {
        gulp.src(['rev/*.json', 'application/head.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
            .pipe(revCollector({replaceReved:true}))                                   //- 执行文件内css名的替换
            .pipe(gulp.dest('application/'));                     //- 替换后的文件输出的目录
    });
    gulp.task('serve',['sass'],function() {
        browserSync.init({
            proxy: "testtest:8087/ecstore2.3.77"
            // server:'./'
        });
        gulp.watch("/Volumes/c/www/ecstore2.3.77/themes/TSINOVA/images/*.scss", ['sass']);
        gulp.watch("/Volumes/c/www/ecstore2.3.77/themes/**/*.css").on('change',browserSync.reload)
        gulp.watch("/Volumes/c/www/ecstore2.3.77/themes/TSINOVA/*.html").on('change', browserSync.reload);
        // gulp.watch("js/*.js", ['js']);
    });
   
    gulp.task('default', ['serve']);
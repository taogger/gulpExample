var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    horizontal = require('gulp-clean-css'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat')
    //- 对文件名加MD5后缀
	rev = require('gulp-rev');
    runSequence = require('run-sequence');
	//- 路径替换
	revCollector = require('gulp-rev-collector');
    var browserSync = require('browser-sync').create();

    gulp.task('sass', function() {
        return sass('dist/sass/*.scss', {style: "expanded"})
            //.pipe(sass({style: "expanded"}))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            // .pipe(rename({suffix: '.min'}))
            // .pipe(cleancss())
            .pipe(gulp.dest('dist/css'))
            .pipe(notify({ message: 'Styles task complete' }))
            .pipe(browserSync.stream());
    });
    gulp.task('js', function () {
        return gulp.src('dist/js/*.js')
            // .pipe(browserify())
            .pipe(uglify())
            .pipe(gulp.dest('dist/js/min'))
            .pipe(browserSync.stream());
    });
   	gulp.task('scripts', function() {
	  gulp.src('dist/js/min/*.js')
	    .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rev()) 
	    .pipe(gulp.dest('dist/js/compass'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
	});
    gulp.task('clean',function(){
        return gulp.src('dist/css/compass',{read:false})
               .pipe(clean());
    })
	gulp.task('concat', function() {//- 创建一个名为 concat 的 task
	   return gulp.src('dist/css/*.css')    //- 需要处理的css文件，放到一个字符串数组里
	        .pipe(concat('total.css'))                            //- 合并后的文件名
	        .pipe(horizontal())                                      //- 压缩处理成一行
	        .pipe(rev())                                            //- 文件名加MD5后缀
	        .pipe(gulp.dest('dist/css/compass'))                    //- 输出文件本地
	        .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
		    .pipe(gulp.dest('rev/css'));                 //- 将 rev-manifest.json 保存到 rev 目录内
	});
   
	gulp.task('rev', function() {
	    return gulp.src(['rev/**/*.json', 'index.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
	        .pipe(revCollector({replaceReved:true}))                                   //- 执行文件内css名的替换
	        .pipe(gulp.dest(''));                     //- 替换后的文件输出的目录
	});
    gulp.task('serve', ['sass'], function() {
        browserSync.init({
            server: "./"
        });
        gulp.watch("dist/sass/*.scss", ['sass']);
        gulp.watch("*.html").on('change', browserSync.reload);
        gulp.watch("dist/js/*.js", ['js']);
    });

    gulp.task('default',['serve'],function(){
        runSequence('clean','scripts','js','concat','rev');
    });
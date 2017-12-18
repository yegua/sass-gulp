var gulp = require('gulp'),
seajsCombo = require( 'gulp-seajs-combo' );
var sass=require('gulp-sass');
var connect=require('gulp-connect');//本地服务
var concat=require('gulp-concat');//合并文件

var rename=require('gulp-rename');//压缩后文件命名
var imagemin=require('gulp-imagemin'),
cache = require('gulp-cache'),//只压缩修改的图片,没有修改的图片直接从缓存文件读取
pngquant = require('imagemin-pngquant');
var minifyCss=require('gulp-minify-css');//压缩css文件
var uglify=require('gulp-uglify');//压缩js文件
var webserver=require('gulp-webserver');
var babel=require('gulp-babel');//es6编译
var notify = require('gulp-notify');//显示报错信息和报错后不终止当前gulp任务
var autoprefixer = require('gulp-autoprefixer');//自动加上浏览器兼容前缀
var livereload = require('gulp-livereload');//当监听文件发生变化时，浏览器自动刷新页面。

/*****************大客户改版界面**********************/
gulp.task('copyIndex',function(){
	return gulp.src('vip/*.html')
	.pipe(gulp.dest('new-vip'));
});
var CssFiles=['vip/css/*.scss'];
gulp.task('scss',function(){
	return gulp.src(CssFiles)
	.pipe(sass({outputStyle: 'expanded'}))
	.pipe(gulp.dest('new-vip/css'));
});
gulp.task('css',function(){
	return gulp.src('vip/css/*.css')
	.pipe(minifyCss())
	.pipe(gulp.dest('new-vip/css'));
});
gulp.task('fonts',function(){
	return gulp.src('vip/fonts/*')
	.pipe(gulp.dest('new-vip/fonts'));
});
gulp.task('packjs',function(){
	return gulp.src('vip/js/**/*')
	.pipe(uglify())
	.pipe(gulp.dest('new-vip/js'))
});
gulp.task('webserver',function(){
	gulp.src('./')
	.pipe(webserver({
		livereload:true,
		directoryListing:{
			enable:true,
			path:'./'
		},
		port:60,
		host:'192.168.10.19'
	}));
});
gulp.task('imgs',function(){
	return gulp.src(['vip/images/*.png','vip/images/*.jpg'])
	.pipe(gulp.dest('new-vip/images'));
});


/************************分界线**************************/
gulp.task('es6html',function(){
	return gulp.src('assets/es6/*.html')
	.pipe(gulp.dest('weixin/es6'));
});

gulp.task('demojs',function(){
	return gulp.src('assets/es6/demojs/*.js')
	.pipe(babel())
	.pipe(gulp.dest('weixin/es6/demojs'));
});

gulp.task('espackjs',function(){
	return gulp.src('assets/es6/js/*.js')
	.pipe(seajsCombo())
	.pipe(gulp.dest('weixin/es6/js'));
});

//我的主页设置
gulp.task('myIndex',function(){
	return gulp.src('myweb/*.html')
	.pipe(gulp.dest('myblog'));
});

//我的主页图片设置
gulp.task('myimgs',function(){
	return gulp.src(['myweb/images/*.png','myweb/images/*.jpg'])
	.pipe(gulp.dest('myblog/images'));
});

//我的主页scss设置
gulp.task('myscss',function(){
	return gulp.src('myweb/scss/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('myblog/css'))
	.pipe(livereload());
});

//我的主页css设置
gulp.task('mycss',function(){
	return gulp.src('myweb/css/*.css')
	.pipe(gulp.dest('myblog/css'));
});

//我的主页js设置
gulp.task('mypackjs',function(){
	return gulp.src('myweb/js/**/*')
	.pipe(gulp.dest('myblog/js'))
});

//快运微信界面开发
gulp.task('kuai-scss',function(){
	return gulp.src('kuaiyun-assets/sass/*.scss')
	.pipe(sass({outputStyle: 'expanded'}))
	 .pipe(autoprefixer({
        browsers: ['last 2 versions', 'Android >= 4.0','ios 6','safari 5'],
        cascade: true, //是否美化属性值 默认：true 像这样：
        //-webkit-transform: rotate(45deg);
        //        transform: rotate(45deg);
        remove:true //是否去掉不必要的前缀 默认：true
    }))
	.pipe(gulp.dest('kuaiyun-weixin/css'));
});
gulp.task('kuai-img',function(){
	return gulp.src(['kuaiyun-assets/images/*.jpg','kuaiyun-assets/images/*.png','kuaiyun-assets/images/*.gif'])
	.pipe(gulp.dest('kuaiyun-weixin/images'));
});
gulp.task('kuai-js',function(){
	return gulp.src('kuaiyun-assets/js/**/*')
	.pipe(gulp.dest('kuaiyun-weixin/js'));
});
gulp.task('kuai-html',function(){
	return gulp.src('kuaiyun-assets/htmls/*.html')
	.pipe(gulp.dest('kuaiyun-weixin/htmls'));
});


//gulp-api测试
/*
	.pipe(jshint('.jshintrc'))//进行代码检查
    .pipe(jshint.reporter('default'))//对代码进行报错提示
    jshint仅仅是javascript的语法检查工具，检测不出来我们的逻辑问题
*/
gulp.task('scripts', function() { 
  return gulp.src(['myweb/js/customers/index.js','myweb/main.js'])
    .pipe(concat('newMain.js'))//合并后的文件名
    .pipe(gulp.dest('myblog/scripts'))
    .pipe(rename({ suffix: '.min' }))//重命名
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('myblog/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
// 样式测试
gulp.task('styles', function() { 
  return gulp.src('myweb/scss/*.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4','chrome 48'))//自动加兼容前缀
    .pipe(gulp.dest('myblog/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifyCss())//压缩重命名
    .pipe(gulp.dest('myblog/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// 图片测试
/*使用pngquant深度压缩png图片的imagemin插件*/
gulp.task('images', function() { 
  return gulp.src('myweb/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
    })))
    .pipe(gulp.dest('myblog/imagesTest'))
    .pipe(notify({ message: 'Images task complete' }));
});
gulp.task('watch',function(){
	gulp.watch('kuaiyun-assets/htmls/*.html',['kuai-html']);
	gulp.watch('kuaiyun-assets/sass/*.scss',['kuai-scss']);
	gulp.watch('kuaiyun-assets/js/**/*',['kuai-js']);
	gulp.watch(['kuaiyun-assets/images/*.jpg','kuaiyun-assets/images/*.png','kuaiyun-assets/images/*.gif'],['kuai-img']);
	
});

gulp.task('default',['webserver','watch']);

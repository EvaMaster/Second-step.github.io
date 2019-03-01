var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    cssmin = require('gulp-minify-css'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    pngquant = require('imagemin-pngquant'),
    path = {
        build: {
            html: 'build/',
            js: 'build/',
            css: 'build/',
            img: 'build/',
            fonts: 'build/'
        },
        src: {
            html: 'src/index.html', 
            js: 'src/main.js',
            style: 'src/**/**/*.scss',
            img: 'src/**/img/*.png',
            fonts: 'src/**/fonts/*.ttf'
        },
        watch: {
            html: 'src/**/*.html',
            js: 'src/**/js/*.js',
            style: 'src/**/**/*.scss',
            img: 'src/**/img/*.png',
            fonts: 'src/**/fonts/*.ttf'
        }
};

gulp.task('html:build', done => {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        done();
});

gulp.task('style:build', done => {
    gulp.src(path.src.style)
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(cssmin()) 
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        done();
});

gulp.task('image:build', done => {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        done();
});


gulp.task('fonts:build', done => {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        done();
});


gulp.task('reload-css', done => {
    gulp.src(path.src.style)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.build.css))
    .pipe(sourcemaps.init())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(livereload())
    done();
});

gulp.task('default', function () {
    livereload.listen();
    gulp.watch('src/**/*.scss', ['style:build']);
});

gulp.task('watch', function(done){
    gulp.watch([path.watch.style], gulp.series('style:build'));
    gulp.watch([path.watch.html], gulp.series('html:build'));
    gulp.watch([path.watch.fonts], gulp.series('fonts:build'));
    gulp.watch([path.watch.img], gulp.series('image:build'));
    gulp.watch([path.watch.style], gulp.series('reload-css'));
    livereload.listen();
    done();
});



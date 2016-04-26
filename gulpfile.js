var gulp = require('gulp'),
    gulpLess = require('gulp-less'),
    gulpStylus = require('gulp-stylus'),
    gulpMyth = require('gulp-myth'),
    gulpUtil = require('gulp-util'),
    gulpUglify = require('gulp-uglify'),
    gulpJade = require('gulp-jade'),
    gulpConcat = require('gulp-concat'),
    gulpPrompt = require('gulp-prompt'),
    gulpFtp = require('gulp-ftp'),
    buildPath = './build';

function wrapPipe(taskFn) {
    return function (done) {
        var onSuccess = function () {
            done();
        };
        var onError = function (err) {
            done(err);
        };
        var outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    }
}

gulp.task('default', function () {
    gulp.watch('./src/**/*.less', ['less']);
    gulp.watch('./src/**/*.styl', ['stylus']);
    gulp.watch('./src/**/*.jade', ['jade']);
    gulp.watch('./src/**/*.js', ['js']);
});

gulp.task('less', wrapPipe(function (success, error) {
    return gulp.src('./src/**/*.less')
        .pipe(gulpLess().on('error', error))
        .pipe(gulpMyth({compress: true}).on('error', error))
        .pipe(gulp.dest(buildPath));
}));

gulp.task('stylus', wrapPipe(function (success, error) {
    return gulp.src('./src/**/*.styl')
        .pipe(gulpStylus().on('error', error))
        .pipe(gulpMyth({compress: true}).on('error', error))
        .pipe(gulp.dest(buildPath));
}));


gulp.task('jade', wrapPipe(function (success, error) {
    return gulp.src('./src/**/*.jade')
        .pipe(gulpJade().on('error', error))
        .pipe(gulp.dest(buildPath));
}));

gulp.task('js', wrapPipe(function (success, error) {
    return gulp.src(['./node_modules/jquery/dist/jquery.min.js', './src/**/*.js'])
        .pipe(gulpConcat('index.js').on('error', error))
        .pipe(gulpUglify().on('error', error))
        .pipe(gulp.dest(buildPath));
}));

var async = require('async');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var runTimestamp = Math.round(Date.now() / 1000);
var imageminSvgo = require('imagemin-svgo');

gulp.task('svgmin', wrapPipe(function (success, error) {
    return gulp.src(['./font/*.svg'])
        .pipe(imageminSvgo()())
        .pipe(gulp.dest('./font/clean/'));
}));


gulp.task('Iconfont', function (done) {
    var iconStream = gulp.src(['./font/*.svg'])
        .pipe(imageminSvgo()())
        .pipe(iconfont({
            fontName: 'iviglyphs',
            prependUnicode: true,
            formats: ['ttf', 'eot', 'woff'],
            timestamp: runTimestamp
        }));

    async.parallel([
        function handleGlyphs(cb) {
            iconStream.on('glyphs', function (glyphs, options) {
                console.log(options, glyphs);
                gulp.src('./font/font-template.styl')
                    .pipe(consolidate('lodash', {
                        glyphs: glyphs,
                        options: options
                    }))
                    .pipe(gulp.dest('./font/build/'))
                    .on('finish', cb);
            });
        },
        function handleFonts(cb) {
            iconStream
                .pipe(gulp.dest('./font/build/'))
                .on('finish', cb);
        }
    ], done);
});
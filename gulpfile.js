var gulp = require('gulp'),
    gulpStylus = require('gulp-stylus'),
    gulpMyth = require('gulp-myth'),
    gulpUtil = require('gulp-util'),
    gulpUglify = require('gulp-uglify'),
    gulpPug = require('gulp-pug'),
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

gulp.task('default', ['styl', 'pug', 'js'], function () {
    gulp.watch('./src/**/*.styl', ['styl']);
    gulp.watch('./src/**/*.pug', ['pug']);
    gulp.watch('./src/**/*.js', ['js']);
});

gulp.task('styl', wrapPipe(function (success, error) {
    return gulp.src('./src/**/*.styl')
        .pipe(gulpStylus().on('error', error))
        .pipe(gulpMyth({compress: true}).on('error', error))
        .pipe(gulp.dest(buildPath));
}));

gulp.task('pug', wrapPipe(function (success, error) {
    return gulp.src('./src/**/*.pug')
        .pipe(gulpPug().on('error', error))
        .pipe(gulp.dest(buildPath));
}));

gulp.task('js', wrapPipe(function (success, error) {
    return gulp.src(['./node_modules/jquery/dist/jquery.min.js', './src/**/*.js'])
        .pipe(gulpConcat('index.js').on('error', error))
        .pipe(gulpUglify().on('error', error))
        .pipe(gulp.dest(buildPath));
}));

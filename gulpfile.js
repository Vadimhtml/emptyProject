var gulp = require('gulp'),
    gulpStylus = require('gulp-stylus'),
    gulpMyth = require('gulp-myth'),
    gulpUtil = require('gulp-util'),
    gulpUglify = require('gulp-uglify'),
    gulpPug = require('gulp-pug'),
    gulpConcat = require('gulp-concat'),
    gulpPrompt = require('gulp-prompt'),
    gulpFtp = require('gulp-ftp'),
    gulpBabel = require('gulp-babel'),
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

gulp.task('default', ['styl', 'pug', 'js', 'app'], function () {
    gulp.watch('./src/**/*.styl', ['styl']);
    gulp.watch('./src/**/*.pug', ['pug']);
    gulp.watch('./src/**/*.js', ['js']);
    gulp.watch('./src/**/*.js', ['app']);
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

gulp.task('app', wrapPipe(function (success, error) {
    return gulp.src(['./src/**/*.js'])
        .pipe(gulpBabel({
            presets: ['react']
        }))
        .pipe(gulp.dest(buildPath));
}));


gulp.task('js', wrapPipe(function (success, error) {
    return gulp.src(['./node_modules/react/dist/react.js', './node_modules/react-dom/dist/react-dom.js'])
        .pipe(gulp.dest(buildPath));
}));

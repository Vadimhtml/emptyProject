var gulp = require('gulp'),
    gulpLess = require('gulp-less'),
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
    gulp.watch('./src/**/*.jade', ['jade']);
    gulp.watch('./src/**/*.js', ['js']);
});

gulp.task('less', wrapPipe(function (success, error) {
    return gulp.src('./src/**/*.less')
        .pipe(gulpLess().on('error', error))
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

/**
 * Created by rapelt on 6/07/2016.
 */
var gulp = require('gulp');
var Server = require('karma').Server;
var mochaSelenium = require('gulp-mocha');

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma-config.js',
        singleRun: true
    }, done).start();
});

gulp.task('selenium', function () {
    return gulp.src('selenium-tests/Test.js', {read: false})
        .pipe(mochaSelenium({
            reporter: 'nyan'
        }));
});

gulp.task('default', ['test', 'selenium']);

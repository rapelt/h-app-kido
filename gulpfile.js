/**
 * Created by rapelt on 6/07/2016.
 */
var gulp = require('gulp');
var Server = require('karma').Server;
var mochaSelenium = require('gulp-mocha-selenium');
var jasmineNode = require('gulp-jasmine-node');

gulp.task('google-test', function () {
    return gulp.src(['tests/google.test.js']).pipe(jasmineNode({
        timeout: 10000
    }));
});

gulp.task('angular-tests', function (done) {
    new Server({
        configFile: __dirname + '/karma-config.js',
        singleRun: true
    }, done).start();
});

gulp.task('selenium', function () {
    return gulp.src('selenium-tests/Tests.js', {read: false})
        .pipe(mochaSelenium({
            browserName: 'chrome',
            reporter: 'nyan'
        }));
});

gulp.task('default', ['angular-tests', 'selenium', 'google-test']);

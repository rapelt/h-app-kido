/**
 * Created by rapelt on 6/07/2016.
 */
var gulp = require('gulp');
var Server = require('karma').Server;
var gutil = require('gulp-util');

// create a default task and just log a message
/*
gulp.task('default', function() {
    return gutil.log('Gulp is running!')
});
*/

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma-config.js',
        singleRun: true
    }, done).start();
});

gulp.task('default', ['test']);

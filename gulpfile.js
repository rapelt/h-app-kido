/**
 * Created by rapelt on 6/07/2016.
 */
var gulp = require('gulp');
var Server = require('karma').Server;

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma-config.js',
        singleRun: true
    }, done).start();
});

gulp.task('default', ['test']);

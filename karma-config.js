// Karma configuration
// Generated on Mon Apr 11 2016 13:33:48 GMT+1000 (AEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './node_modules/angular/angular.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './node_modules/jquery/dist/jquery.js',
      './node_modules/angular-sanitize/angular-sanitize.js',
      'app/test/testUtils.js',
      'app/js/*.js',
      'app/app.js',
      'app/app-services/*.js',
      'app/account/*.js',
      'app/edit-user/*.js',
      'app/class-attendance/*.js',
      'app/test/*Spec.js',
      'app/test/account-tests/*Spec.js',
      'app/test/app-services-tests/*Spec.js',
      'app/test/techniques-tests/*Spec.js',
      'app/test/class-attendance-tests/*Spec.js',
      'app/test/edit-users-tests/*Spec.js'
    ],


    // list of files to exclude
    exclude: [
      'no'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

window.jQuery = $ = require('jquery')
var cssify = require('cssify')

var bootstrap = require('bootstrap/dist/js/bootstrap')

require('../node_modules/bootstrap/dist/css/bootstrap.min.css')

var angular = require('angular')
var angularroute = require('angular-route')
var angularcookies = require('angular-cookies')

var app = require('./app.js')
require('./app-services/authentication.service.js');
require('./app-services/user.service.local-storage.js');
require('./home/home.controller.js');
require('./login/login.controller.js')
require('./register/register.controller.js')
require('./app-services/flash.service.js')
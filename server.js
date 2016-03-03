require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: process.env.secret, resave: false, saveUninitialized: true }));
app.use('/images', express.static('app/media/images'));
app.use('/', express.static('app/media'));


// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: process.env.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/technique', require('./controllers/api/technique.controller'));

/*app.all('/!*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname });
});*/


// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});




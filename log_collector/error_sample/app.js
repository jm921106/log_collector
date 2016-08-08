var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser'); //cookie 처리
var bodyParser = require('body-parser'); // body 해석

var app = express(); //서버동작

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs'); //view의 엔진으로 ejs를 사용

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./app/routes/exception.server.routes.js').route(app);
require('./app/routes/test.server.routes.js').route(app);
require('./config/mongodb.js').connect();

/*
* app.js 에서의 오류 핸들링 테스트
* */
// try {
//   setTimeout(function () {
//   throw new URIError('Hello', 'someFile.js', 10);
// }, 500);
// }
// catch (exception) {
//   console.log(exception);
// }

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var submitRouter = require('./routes/submit');
var resultsRouter = require('./routes/results');

var db = require('./database.js')
const bodyParser = require("body-parser");
const { syncBuiltinESMExports } = require('module');
var request = require('request');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/submit', submitRouter);
app.use('/results', resultsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function lotteryCycle() {
  while (true) {
    await sleep(30000);

    console.log('pickinig winner..');
    pickWinners();
  }
}

async function pickWinners() {
  console.log('0')
  request('https://celtra-lottery.herokuapp.com/api/getLotteryNumber', function (err, res) {
    let json = JSON.parse(res.body);

    console.log('1')
    let select = "select * from entry WHERE timestamp > datetime(?, '-30 seconds') AND number = ?"
    var insert = "INSERT INTO result (timestamp, number, winners) VALUES (?,?,?)"
    let params = [json.createdAt, json.lotteryNumber];

    db.all(select, params, (err, rows) => {
      console.log('2' + json.createdAt + " " + json.lotteryNumber);
      console.log('2' + rows.map(f => f.name).join(', '));

      db.run(insert, [json.createdAt, json.lotteryNumber, rows.length == 0 ? 'No lucky winner' : rows.map(f => f.name).join(', ')], function (err) {
        if (err) {
          console.log('Error inserting lottery results');
          return;
        }
        console.log(`Winning number ${json.lotteryNumber} picked`);
      });
    });
    console.log('3')
  });
}

lotteryCycle();

module.exports = app;

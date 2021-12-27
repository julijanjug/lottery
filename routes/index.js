var express = require('express');
var router = express.Router();
var db = require('../database.js')


/* GET home page. */
router.get('/', function (req, res, next) {
  var results = [];
  let params = [];
  var sql = "select * from results ORDER BY timestamp desc LIMIT 5"
  db.all(sql, params, (err, rows) => {
    if (err) {
      return;
    }
    if (results)
      results = rows;
  });
  console.log(results);
  res.render('index', { title: 'Lottery', results: results, submitUrl: "http://localhost:3000/submit", resultsUrl: "http://localhost:3000/results" });
});

module.exports = router;

var express = require("express");
var router = express.Router();
var db = require('../database.js')

router.post('/', (req, res) => {
    var insert = 'INSERT INTO entry (name, number) VALUES (?,?)'
    db.run(insert, [req.body.name, req.body.number], function (err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": this.lastID
        });
        console.log(`Inserted entry ${this.lastID}`);
    });
});

module.exports = router;

var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE entry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            number integer,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO entry (name, number) VALUES (?,?,?)'
                    // db.run(insert, ["admin","admin@example.com",md5("admin123456")])
                }
            });

        db.run(`CREATE TABLE result (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            number integer,
            winners text
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO result (timestamp, number, winners) VALUES (?,?,?)'
                    db.run(insert, [Date.now(), 0, ""])
                }
            });

        // db.run(`CREATE TABLE winners (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT,
        //         result integer, 
        //         entry integer
        //         )`,
        //     (err) => {
        //         if (err) {
        //             // Table already created
        //         } else {
        //             // Table just created, creating some rows
        //             var insert = 'INSERT INTO winners (result, entry) VALUES (?,?)'
        //         }
        //     });
    }
});


module.exports = db
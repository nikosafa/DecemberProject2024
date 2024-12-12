
const express = require('express');
const mysql = require('mysql2'); //npm install mysql2 --save
const cors = require('cors'); //npm install cors --save
const path = require('path');

const app = express();
const port = 3000;

// Middleware
//app.use(express.static(path.join(__dirname, '../../../Frontend')));
app.use(express.json());
app.use(cors());

// Database Connection
const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: "ukraine"
});


//Chart1
app.get('/chart1', (req, res) => {
    const query = 'SELECT category, SUM(total_interactions) AS total_interactions ' +
    'FROM metrics ' +
    'JOIN sourcepop ON metrics.ccpageid = sourcepop.ccpageid ' +
    'GROUP BY category';

    connection.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching ukraine data');
            return;
        }
        res.json(result);
    });
});


//Chart2
app.get ('/chart2', (req, res) => {
    const query = 'SELECT post_type, SUM(total_interactions)\n' +
        'FROM metrics\n' +
        'GROUP BY post_type\n' +
        'limit 7';
    connection.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching ukraine data');
            return;
        }
        res.json(result);
        console.log(result);
    });
    });

//chart 3
app.get ('/chart3', (req, res) => {
    const query = 'SELECT \n' +
        '    CASE \n' +
        '        WHEN country = \'Schweiz\' THEN \'Switzerland\'\n' +
        '        WHEN country = \'Wales\' THEN \'United Kingdom\'\n' +
        '        ELSE country\n' +
        '    END AS country,\n' +
        '    post_type, \n' +
        '    total_interactions\n' +
        'FROM (\n' +
        '    SELECT \n' +
        '        sourcepop.country, \n' +
        '        metrics.post_type, \n' +
        '        SUM(metrics.total_interactions) AS total_interactions,\n' +
        '        RANK() OVER (PARTITION BY sourcepop.country ORDER BY SUM(metrics.total_interactions) DESC) AS rankC\n' +
        '    FROM\n' +
        '        metrics \n' +
        '    JOIN \n' +
        '        sourcepop\n' +
        '    ON \n' +
        '        metrics.ccpageid = sourcepop.ccpageid\n' +
        '    GROUP BY \n' +
        '        sourcepop.country, \n' +
        '        metrics.post_type\n' +
        ') ranked_data\n' +
        'WHERE rankC = 1;\n'
    connection.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching ukraine data');
            return;
        }
        res.json(result);
        console.log(result);
    });
});

//chart 5 - støtte til ukraine over tid
app.get ('/chart5', (req, res) => {
        const query = 'SELECT \n' +
            '\ttime.year,\n' +
            '\tclassification.gpt_ukraine_for_imod,\n' +
            '\tCOUNT(classification.ccpost_id) \n' +
            '    as post_count\n' +
            'FROM classification\n' +
            '\t\n' +
            'JOIN time ON classification.ccpost_id = time.ccpost_id\n' +
            'WHERE time.year >= 2021\n' +
            'GROUP BY gpt_ukraine_for_imod, time.year\n' +
            'ORDER BY time.year;'

        connection.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error fetching ukraine data');
                return;
            }
            res.json(result);
            console.log(result);
        });
    });


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



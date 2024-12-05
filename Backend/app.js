
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
        'GROUP BY category;';

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

app.get ('/chart3', (req, res) => {
    const query = 'SELECT \n' +
        '    sourcepop.category,\n' +
        '    sourcepop.country,\n' +
        '    metrics.post_type,\n' +
        '    metrics.total_interactions\n' +
        'FROM \n' +
        '    metrics\n' +
        'JOIN \n' +
        '    sourcepop\n' +
        'ON \n' +
        '    metrics.ccpageid = sourcepop.ccpageid\n' +
        'ORDER BY \n' +
        '    metrics.total_interactions DESC\n' +
        'LIMIT 10;\n';
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



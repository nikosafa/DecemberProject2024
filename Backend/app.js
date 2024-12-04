
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

app.get ('/chart2', (req, res) => {
    const query = 'SELECT post_type, SUM(total_interactions)\n' +
        'FROM metrics\n' +
        'GROUP BY post_type\n';
    connection.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching ukraine data');
            return;
        }
        res.json(result);
    });
    });


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



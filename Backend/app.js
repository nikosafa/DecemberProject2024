
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


app.get('/greetings', (req, res) => {
    res.send('Hello this is a greeting');
})

app.listen(port, () => {
    console.log(port)
})


